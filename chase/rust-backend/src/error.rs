use std::fmt::Display;

use axum::response::IntoResponse;

#[derive(Debug)]
pub enum CustomHandlerError {
    GraphQLError(async_graphql::Error),
    DBError(sea_orm::DbErr),
}

impl Display for CustomHandlerError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            CustomHandlerError::GraphQLError(err) => write!(f, "GraphQL error: {:#?}", err),
            CustomHandlerError::DBError(err) => write!(f, "DB error: {:#?}", err),
        }
    }
}

impl From<async_graphql::Error> for CustomHandlerError {
    fn from(err: async_graphql::Error) -> Self {
        CustomHandlerError::GraphQLError(err)
    }
}

impl From<sea_orm::DbErr> for CustomHandlerError {
    fn from(err: sea_orm::DbErr) -> Self {
        CustomHandlerError::DBError(err)
    }
}

// TODO check which errors are safe to return to the frontend and do so for debugging
// https://docs.rs/axum/latest/axum/response/index.html#building-responses
impl IntoResponse for CustomHandlerError {
    fn into_response(self) -> axum::response::Response {
        axum::http::StatusCode::INTERNAL_SERVER_ERROR.into_response()
    }
}
