use tokio::{
    io::{self, AsyncBufReadExt, AsyncWriteExt, BufReader},
    net::UnixStream,
    sync::Mutex,
};

use crate::messages::{
    AddInterfaceRequest, AddUserRequest, ExportClientRequest, QueryInterface, QueryUser, RemoveInterfaceRequest, RemoveUserRequest, WgmdAnswer, WgmdMessages,
};

type Answer = io::Result<WgmdAnswer>;

pub struct SocketConnection {
    listener: Mutex<UnixStream>,
}

impl SocketConnection {
    pub fn new(listener: UnixStream) -> Self {
        Self {
            listener: Mutex::new(listener),
        }
    }

    pub async fn add_interface(&self, req: AddInterfaceRequest) -> Answer {
        self.send(WgmdMessages::AddInterface(req)).await
    }

    pub async fn remove_interface(&self, req: RemoveInterfaceRequest) -> Answer {
        self.send(WgmdMessages::RemoveInterface(req)).await
    }

    pub async fn query_all_interfaces(&self) -> Answer {
        self.send(WgmdMessages::QueryAllInterfaces).await
    }

    pub async fn query_interface(&self, req: QueryInterface) -> Answer {
        self.send(WgmdMessages::QueryInterface(req)).await
    }

    pub async fn add_user(&self, req: AddUserRequest) -> Answer {
        self.send(WgmdMessages::AddUser(req)).await
    }

    pub async fn remove_user(&self, req: RemoveUserRequest) -> Answer {
        self.send(WgmdMessages::RemoveUser(req)).await
    }

    pub async fn query_user(&self, req: QueryUser) -> Answer {
        self.send(WgmdMessages::QueryUser(req)).await
    }

    pub async fn export(&self) -> Answer {
        self.send(WgmdMessages::Export).await
    }

    pub async fn export_client(&self, req: ExportClientRequest) -> Answer {
        self.send(WgmdMessages::ExportClient(req)).await
    }

    async fn send(&self, msg: WgmdMessages) -> Answer {
        let data = serde_json::to_vec(&msg).unwrap();
        let mut listener = self.listener.lock().await;
        listener.write_all(&data).await?;
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
