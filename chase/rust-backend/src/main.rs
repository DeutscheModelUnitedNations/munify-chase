mod committees;
mod conferences;
mod users;
use std::error::Error;

use async_graphql::{http::GraphiQLSource, EmptyMutation, EmptySubscription, MergedObject, Schema};
use async_graphql_poem::GraphQL;
use committees::query::CommitteeQuery;
use conferences::query::ConferenceQuery;
use poem::{get, handler, listener::TcpListener, web::Html, IntoResponse, Route, Server};
use users::query::UserQuery;

#[handler]
async fn graphql_playground() -> impl IntoResponse {
    Html(GraphiQLSource::build().endpoint("/graphql").finish())
}

#[derive(MergedObject, Default)]
struct Query(ConferenceQuery, UserQuery, CommitteeQuery);

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await?;

    // db.signin(Root {
    //     username: "root",
    //     password: "root",
    // })
    // .await?;

    db.use_ns("dev").use_db("dev").await?;

    let schema = Schema::new(Query::default(), EmptyMutation, EmptySubscription);

    let app = Route::new().at(
        "/graphql",
        get(graphql_playground).post(GraphQL::new(schema)),
    );

    println!("Playground: http://localhost:8000/graphql");
    Server::new(TcpListener::bind("127.0.0.1:8000"))
        .run(app)
        .await?;
    Ok(())
}
