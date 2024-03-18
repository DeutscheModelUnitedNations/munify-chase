use async_graphql::{InputObject, SimpleObject};
use serde::{Deserialize, Serialize};

pub mod query;

#[derive(SimpleObject, InputObject, Default, Debug, Serialize, Deserialize)]
#[graphql(input_name = "CommitteeInput")]
pub struct Committee {
    id: String,
    name: String,
}
