mod committees;
mod conferences;
mod config;
mod error;
mod users;
mod traits;
use std::error::Error;

use async_graphql::{http::GraphiQLSource, EmptyMutation, EmptySubscription, MergedObject, Schema};
use async_graphql_poem::GraphQL;
use committees::query::CommitteeQuery;
use conferences::query::ConferenceQuery;
use poem::{
    get, handler, listener::TcpListener, web::Html, IntoResponse, Route, Server,
};
use surrealdb::{engine::remote::ws::Ws, Surreal};
use users::query::UserQuery;

use crate::config::read_config;

#[handler]
async fn graphql_playground() -> impl IntoResponse {
    Html(GraphiQLSource::build().endpoint("/graphql").finish())
}

#[derive(MergedObject, Default)]
struct Query(ConferenceQuery, UserQuery, CommitteeQuery);

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    simple_logger::SimpleLogger::new()
        .with_level(log::LevelFilter::Info)
        .with_colors(true)
        .init()
        .expect("Could not enable logger!");

    log::info!("Reading configuration...");
    let config = read_config()?;
    let db = Surreal::new::<Ws>(format!("127.0.0.1:{}", config.db.port)).await?;

    // db.signin(Root {
    //     username: "root",
    //     password: "root",
    // })
    // .await?;

    db.use_ns(config.db.namespace)
        .use_db(config.db.database)
        .await?;

    let schema = Schema::build(Query::default(), EmptyMutation, EmptySubscription)
        .data(db)
        .finish();
    let app = Route::new().at(
        "/graphql",
        get(graphql_playground).post(GraphQL::new(schema)),
    );

    println!("Playground: http://localhost:{}/graphql", config.port);
    Server::new(TcpListener::bind(format!("127.0.0.1:{}", config.port)))
        .run(app)
        .await?;
    Ok(())
}
