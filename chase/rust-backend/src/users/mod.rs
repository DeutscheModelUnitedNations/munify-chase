use async_graphql::{InputObject, SimpleObject};
use serde::Serialize;

pub mod query;

#[derive(SimpleObject, InputObject, Default, Debug, Serialize)]
#[graphql(input_name = "UserInput")]
pub struct User {
    id: String,
    name: String,
    start: chrono::NaiveDate,
    end: chrono::NaiveDate,
}
