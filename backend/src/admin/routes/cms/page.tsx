import { Container, Heading, Text, Button, Input, Textarea } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DocumentText } from "@medusajs/icons"

// Simple CMS Admin Page
const CmsAdminPage = () => {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    heroTitle: "",
    heroSub: "",
    ctaText: "",
    ctaUrl: "",
    seoTitle: "",
    seoDesc: "",
  })

  useEffect(() => {
    fetch("/admin/cms/homepage")
      .then((res) => {
        if (!res.ok) throw new Error("Not found")
        return res.json()
      })
      .then((data) => {
        if (data.content && data.content.data) {
          setContent(data.content)
          setFormData(data.content.data)
        }
        setLoading(false)
      })
      .catch((e) => {
        // Not found, create it later
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      type: "global",
      handle: "homepage",
      data: formData,
    }

    try {
      if (content?.id) {
        // Update
        await fetch(`/admin/cms/homepage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        // Create
        await fetch(`/admin/cms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }
      alert("Homepage content saved successfully!")
    } catch (e) {
      alert("Failed to save content")
    }
    setSaving(false)
  }

  if (loading) return <Container>Loading...</Container>

  return (
    <Container className="p-8">
      <Heading className="mb-4">Website CMS Manager</Heading>
      <Text className="text-ui-fg-subtle mb-8">Manage the content of your storefront dynamically.</Text>

      <div className="flex flex-col gap-6 max-w-[600px]">
        <div>
          <Heading level="h2" className="mb-2">Homepage Hero</Heading>
          <div className="flex flex-col gap-4">
            <div>
              <Text className="mb-1 font-medium">Hero Title</Text>
              <Input
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                placeholder="e.g., Play In Style"
              />
            </div>
            <div>
              <Text className="mb-1 font-medium">Hero Subtitle</Text>
              <Textarea
                value={formData.heroSub}
                onChange={(e) => setFormData({ ...formData, heroSub: e.target.value })}
                placeholder="e.g., Premium kidswear..."
              />
            </div>
            <div>
              <Text className="mb-1 font-medium">CTA Button Text</Text>
              <Input
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                placeholder="e.g., Shop the drop"
              />
            </div>
            <div>
              <Text className="mb-1 font-medium">CTA URL</Text>
              <Input
                value={formData.ctaUrl}
                onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                placeholder="e.g., /new-arrivals"
              />
            </div>
          </div>
        </div>

        <div>
          <Heading level="h2" className="mb-2">SEO Metadata</Heading>
          <div className="flex flex-col gap-4">
            <div>
              <Text className="mb-1 font-medium">SEO Title</Text>
              <Input
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="e.g., Kindard Kids | Homepage"
              />
            </div>
            <div>
              <Text className="mb-1 font-medium">SEO Description</Text>
              <Textarea
                value={formData.seoDesc}
                onChange={(e) => setFormData({ ...formData, seoDesc: e.target.value })}
                placeholder="e.g., Shop premium kids streetwear..."
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Button onClick={handleSave} isLoading={saving}>Save Changes</Button>
        </div>
      </div>
    </Container>
  )
// Add the route to the Medusa sidebar
export const config = defineRouteConfig({
  label: "Website CMS",
  icon: DocumentText,
})

export default CmsAdminPage
