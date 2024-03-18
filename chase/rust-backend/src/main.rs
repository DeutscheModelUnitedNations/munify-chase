mod committees;
mod conferences;
mod config;
mod error;
mod users;
use std::{convert::Infallible, error::Error, time::Duration};

use async_graphql::{
    http::{playground_source, GraphQLPlaygroundConfig, GraphiQLSource},
    *,
};
use async_graphql_axum::{GraphQL, GraphQLSubscription};
use axum::{
    response::Html,
    routing::{any, get},
    Router, ServiceExt,
};
use committees::query::CommitteeQuery;
use conferences::query::ConferenceQuery;
use log::info;
use sea_orm::{ConnectOptions, Database, DatabaseConnection};
use users::query::UserQuery;

use crate::{config::read_config, error::CustomHandlerError};

#[derive(MergedObject, Default)]
struct RootQuery(ConferenceQuery, UserQuery, CommitteeQuery);
type RootSchema = Schema<RootQuery, EmptyMutation, EmptySubscription>;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    simple_logger::SimpleLogger::new()
        .with_level(log::LevelFilter::Info)
        .with_colors(true)
        .init()
        .expect("Could not enable logger!");

    info!("Reading configuration...");
    let config = read_config()?;
    info!("Read configuration!");

    let mut opt = ConnectOptions::new(config.db.url);
    opt.max_connections(100)
        .min_connections(5)
        .connect_timeout(Duration::from_secs(8))
        .acquire_timeout(Duration::from_secs(8))
        .idle_timeout(Duration::from_secs(8))
        .max_lifetime(Duration::from_secs(8))
        .sqlx_logging(true)
        .sqlx_logging_level(log::LevelFilter::Info)
        .set_schema_search_path("my_schema"); // Setting default PostgreSQL schema

    info!("Connecting to database...");
    let db = Database::connect(opt).await?;
    info!("Connected to database!");

    info!("Building schema...");
    let schema: RootSchema = Schema::build(RootQuery::default(), EmptyMutation, EmptySubscription)
        .data(db.clone())
        .finish();
    info!("Built schema...");

    info!("Building GraphQL endpoint...");
    let graphql_path = "/graphql";
    let graphql_ws_path = "/graphql/ws";
    let graphql = Router::new()
        .route(
            graphql_path,
            get(Html(
                GraphiQLSource::build()
                    .endpoint(graphql_path)
                    .subscription_endpoint(graphql_ws_path)
                    .finish(),
            ))
            .post_service(GraphQL::new(schema.clone())),
        )
        .route_service(graphql_ws_path, GraphQLSubscription::new(schema));
    info!("GraphQL explorer available at {}!", graphql_path);

    info!("Building health endpoints...");
    let health = Router::new().nest(
        "/health",
        Router::new().route("/available", get(|| async {})).route(
            "/status",
            get(|| async move { db.ping().await.map_err(|err| CustomHandlerError::from(err)) }),
        ),
    );
    info!("Health endpoints available at /health/available and /healt/status!");
    info!("Running server...");
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", config.port))
        .await
        .unwrap();
    axum::serve(listener, graphql.merge(health)).await.unwrap();
    info!("Stopping server...");
    Ok(())
}
