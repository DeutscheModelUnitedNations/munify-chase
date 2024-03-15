use std::fmt::Display;

#[derive(Debug)]
pub enum CustomHandlerError {
    DatabaseError(surrealdb::Error),
    GraphQLError(async_graphql::Error),
}

impl Display for CustomHandlerError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            CustomHandlerError::DatabaseError(err) => write!(f, "Database error: {}", err),
            CustomHandlerError::GraphQLError(err) => write!(f, "GraphQL error: {:#?}", err),
        }
    }
}

impl From<async_graphql::Error> for CustomHandlerError {
    fn from(err: async_graphql::Error) -> Self {
        CustomHandlerError::GraphQLError(err)
    }
}

impl From<surrealdb::Error> for CustomHandlerError {
    fn from(err: surrealdb::Error) -> Self {
        CustomHandlerError::DatabaseError(err)
    }
}
