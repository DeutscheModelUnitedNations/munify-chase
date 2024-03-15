use surrealdb::{engine::remote::ws::Client, Surreal};

use crate::traits::repo::Repository;

use super::Conference;

pub struct ConferenceRepository<'a> {
    db: &'a Surreal<Client>,
}

impl<'a> Repository<'a, Conference, surrealdb::Error, Surreal<Client>>
    for ConferenceRepository<'a>
{
    fn new(db: &'a Surreal<Client>) -> Self {
        Self { db }
    }

    async fn list(&self) -> Result<Vec<Conference>, surrealdb::Error> {
        self.db
            .query("SELECT * FROM conferences")
            .await?
            .check()?
            .take(0)
    }

    async fn create(&self, data: &Conference) -> Result<Conference, surrealdb::Error> {
        self.db
            .query("INSERT INTO conferences (name) VALUES ($1) RETURNING *")
            .bind(&data.name)
            .await?
            .check()?.take(0)
    }
}
