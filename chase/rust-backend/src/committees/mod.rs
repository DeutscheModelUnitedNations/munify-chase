use async_graphql::{InputObject, SimpleObject};

pub mod query;

#[derive(SimpleObject, InputObject, Default)]
#[graphql(input_name = "CommitteeInput")]
pub struct Committee {
    id: String,
    name: String,
}
