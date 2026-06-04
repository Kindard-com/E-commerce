import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DocumentText } from "@medusajs/icons"
import { Container, Heading, Text, Table, Button } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const InvoicesAdminPage = () => {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchInvoices = () => {
    setLoading(true)
    fetch("/admin/invoices")
      .then((res) => res.json())
      .then((data) => {
        setInvoices(data.invoices || [])
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  return (
    <Container className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading>Invoices</Heading>
          <Text className="text-ui-fg-subtle">Manage customer invoices.</Text>
        </div>
        <Button variant="secondary" onClick={fetchInvoices}>Refresh</Button>
      </div>

      {loading ? (
        <Text>Loading invoices...</Text>
      ) : invoices.length === 0 ? (
        <Text>No invoices found.</Text>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Invoice ID</Table.HeaderCell>
              <Table.HeaderCell>Order ID</Table.HeaderCell>
              <Table.HeaderCell>Customer ID</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {invoices.map((inv) => (
              <Table.Row key={inv.id}>
                <Table.Cell>{inv.id}</Table.Cell>
                <Table.Cell>{inv.order_id}</Table.Cell>
                <Table.Cell>
                  <Link to={`/customers/${inv.customer_id}`} style={{ color: "blue", textDecoration: "underline" }}>
                    {inv.customer_id}
                  </Link>
                </Table.Cell>
                <Table.Cell>{inv.amount}</Table.Cell>
                <Table.Cell>{inv.status}</Table.Cell>
                <Table.Cell>{new Date(inv.date).toLocaleDateString()}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Invoices",
  icon: DocumentText,
})

export default InvoicesAdminPage
