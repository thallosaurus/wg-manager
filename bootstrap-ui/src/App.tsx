import { Suspense, use, useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import { Container, ListGroup, Row } from 'react-bootstrap';
import { useParams } from 'react-router';

async function getInterfaces() {
  const data = await fetch("/api/interface")
  return data.json();
}

function InterfaceView() {

  const [data, setData] = useState<any>([]);

  useEffect(() => {
    getInterfaces().then(d => {
      setData(d)
    })
  }, [])

  return (
    <>
      <ListGroup>
        <h2>Interfaces</h2>
        {data.map((v, i) => {
          return <ListGroup.Item key={"if-" + v.id + "-" + i} action href={"/i/" + v.id}>{v.name}</ListGroup.Item>
        })}
      </ListGroup>
    </>
  )
}

export function InterfaceList() {
  return (
    <Container fluid>
      <Row className="p-2 justify-start">
        <InterfaceView />
      </Row>
    </Container>
  )
}

export function InterfaceDetail() {
  const { interfaceId } = useParams();
  return (<Container fluid>
    <Row className="p-4">
      <p>{interfaceId}</p>
    </Row>
  </Container>)
}

export function Home() {
  return (
    <Container fluid className="p-3">
      <h1>Home</h1>
    </Container>
  )
}