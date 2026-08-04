use tokio::{
    io::{self, AsyncBufReadExt, AsyncWriteExt, BufReader},
    net::UnixStream,
    sync::{Mutex},
};

use crate::messages::{
    AddInterfaceRequest, AddUserRequest, QueryInterface, QueryUser, RemoveInterfaceRequest,
    RemoveUserRequest, WgmdAnswer, WgmdMessages,
};

type Answer = io::Result<WgmdAnswer>;

pub struct SocketConnection {
    listener: Mutex<UnixStream>,
}

impl SocketConnection {
    pub fn new(listener: UnixStream) -> Self {
        Self {
            listener: Mutex::new(listener)
        }
    }

    pub async fn add_interface(&self, req: AddInterfaceRequest) -> Answer {
        let data = serde_json::to_vec(&req).unwrap();
        self.send(data).await
    }

    pub async fn remove_interface(&self, req: RemoveInterfaceRequest) -> Answer {
        let data = serde_json::to_vec(&req).unwrap();
        self.send(data).await
    }

    pub async fn query_all_interfaces(&self) -> Answer {
        let data = serde_json::to_vec(&WgmdMessages::QueryAllInterfaces).unwrap();
        self.send(data).await
    }

    pub async fn query_interface(&self, req: QueryInterface) -> Answer {
        let data = serde_json::to_vec(&req).unwrap();
        self.send(data).await
    }

    pub async fn add_user(&self, req: AddUserRequest) -> Answer {
        let data = serde_json::to_vec(&req).unwrap();
        self.send(data).await
    }

    pub async fn remove_user(&self, req: RemoveUserRequest) -> Answer {
        let data = serde_json::to_vec(&req).unwrap();
        self.send(data).await
    }

    pub async fn query_user(&self, req: QueryUser) -> Answer {
        let data = serde_json::to_vec(&req).unwrap();
        self.send(data).await
    }

    pub async fn export(&self) -> Answer {
        let data = serde_json::to_vec(&WgmdMessages::Export).unwrap();
        self.send(data).await
    }

    async fn send(&self, msg: Vec<u8>) -> Answer {
        let mut listener = self.listener.lock().await;
        listener.write_all(&msg).await?;
        listener.write_all(b"\n").await?;
        let rec = Self::receive(&mut *listener).await?;
        Ok(rec)
    }

    async fn receive(stream: &mut UnixStream) -> Answer {
        let mut reader = BufReader::new(stream);
        let mut line = String::new();
        reader.read_line(&mut line).await?;

        Ok(serde_json::from_str(&line)?)
    }
}
