use async_graphql::{ComplexObject, InputObject, SimpleObject};

pub mod query;

#[derive(SimpleObject, InputObject, Default)]
#[graphql(complex, input_name = "UserInput")] // NOTE: If you want the `ComplexObject` macro to take effect, this `complex` attribute is required.
pub struct User {
    id: String,
    name: String,
    start: chrono::NaiveDate,
    end: chrono::NaiveDate,
}

#[ComplexObject]
impl User {}
