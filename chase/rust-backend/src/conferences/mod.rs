use async_graphql::{InputObject, SimpleObject};

use crate::committees::Committee;

pub mod query;

#[derive(SimpleObject, InputObject, Default)]
#[graphql(input_name = "ConferenceInput")] // NOTE: If you want the `ComplexObject` macro to take effect, this `complex` attribute is required.
pub struct Conference {
    id: String,
    name: String,
    start: chrono::NaiveDate,
    end: chrono::NaiveDate,
    committees: Vec<Committee>,
}
