import { Button } from "@/components/ui/button"
import Layout from "./app/layout"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { BrowserRouter, Outlet, Route, Routes } from "react-router"

export function Cards() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>wg0</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="text-sm text-muted-foreground">
            Address
          </div>
          <div>172.16.0.1/24</div>
        </div>

        <div>
          <div className="text-sm text-muted-foreground">
            Endpoint
          </div>
          <div>vpn.example.com</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">
            MTU
          </div>
          <div>1420</div>
        </div>
        <div className="flex gap-2">
          <Button>Edit</Button>
          <Button variant="outline">Generate Config</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function App() {
  return (

      <Layout>
        <Outlet />
      </Layout>
  )
}

export default App
