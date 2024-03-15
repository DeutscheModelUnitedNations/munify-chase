use surrealdb::{engine::remote::ws::Client, Surreal};

use crate::traits::repo::Repository;

use super::Committee;

pub struct CommitteeRepository<'a> {
    db: &'a Surreal<Client>,
}

impl<'a> Repository<'a, Committee, surrealdb::Error, Surreal<Client>> for CommitteeRepository<'a> {
    fn new(db: &'a Surreal<Client>) -> Self {
        Self { db }
    }

    async fn list(&self) -> Result<Vec<Committee>, surrealdb::Error> {
        self.db
            .query("SELECT * FROM committees")
            .await?
            .check()?
            .take(0)
    }
}

impl<'a> CommitteeRepository<'a> {
    pub async fn list_by_conference(
        &self,
        conference_id: &str,
    ) -> Result<Vec<Committee>, surrealdb::Error> {
        self.db
            .query("SELECT * FROM committees")
            .await?
            .check()?
            .take(0)
    }
}
