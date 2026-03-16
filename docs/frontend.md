# 🚗 AI Insurance Claims Automation Platform

Frontend Development Best Practices

This document defines **frontend development best practices** for the **AI-Powered Real-Time Smart Damage Assessment & Intelligent Insurance Automation Platform**.

The goal is to ensure the frontend remains:

* maintainable
* readable
* scalable
* AI-assisted development friendly
* production-grade

The UI should prioritize **clarity, speed, and reliability** because the platform processes **insurance claim submissions, AI analysis results, and fraud detection insights**.

---

# Technologies Used

The frontend stack should remain consistent across the project.

Recommended stack:

* React (Vite)
* TypeScript
* Tailwind CSS
* Axios / Fetch API
* React Router
* React Query or TanStack Query
* Zustand / Nanostores (optional)
* PWA support

---

# 📁 Project Structure

Maintain a **clean and predictable folder structure**.

```
/frontend
  /src
    /components      # Reusable UI components
    /pages           # Page views mapped to routes
    /features        # Feature-specific modules
    /hooks           # Custom React hooks
    /services        # API communication layer
    /stores          # Global state management
    /utils           # Utility functions
    /types           # TypeScript interfaces
    /assets          # Images, icons, static assets
    /styles          # Global styles / Tailwind config
    App.tsx          # Root component
    main.tsx         # Application entry
    router.tsx       # Route configuration
```

### Rules

* **Flat structure is preferred over deep nesting**
* **Group code by feature, not by technology**
* Avoid generic folders like **helpers**
* Components should live **close to where they are used**

---

# ⚛️ React Component Best Practices

React components should remain **small, readable, and focused**.

### When to Create a New Component

Create a new component when:

1. JSX exceeds **30–40 lines**
2. UI element is **reused**
3. Component has a **single responsibility**

---

### ❌ Bad Example

Bloated component.

```tsx
export function Dashboard() {
  return (
    <div>
      <h1>Claims Dashboard</h1>
      <button>Upload Image</button>
      <table>
        {/* claim data */}
      </table>
    </div>
  );
}
```

---

### ✅ Good Example

Split responsibilities.

```tsx
export function Dashboard() {
  return (
    <div>
      <PageTitle>Claims Dashboard</PageTitle>
      <UploadButton />
      <ClaimsTable />
    </div>
  );
}
```

---

### Component Naming

Use clear and descriptive names.

Good examples:

```
DamageUploadCard
ClaimSummaryCard
FraudAlertBanner
AdminClaimTable
DamagePreviewImage
```

Avoid generic names like:

```
Box
Container
Data
Thing
```

---

# 📦 Feature-Based Module Organization

Each major feature should have its own module.

Example:

```
/features
  /claim-upload
  /damage-analysis
  /fraud-detection
  /admin-dashboard
```

Example structure:

```
/features/claim-upload
  ClaimUploadPage.tsx
  UploadImageForm.tsx
  useUploadImage.ts
  uploadService.ts
```

This keeps business logic **localized and easier to maintain**.

---

# 📡 API Communication Best Practices

All API calls must live inside the **services layer**.

```
/services
  apiClient.ts
  claimService.ts
  damageAnalysisService.ts
  fraudService.ts
```

Example:

```ts
export async function uploadDamageImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  return apiClient.post("/claims/upload", formData);
}
```

Rules:

* Never call APIs directly inside components
* Use service functions instead
* Handle errors centrally

---

# 🧠 State Management

Use **local state first**, global state only when necessary.

Preferred hierarchy:

```
Component state (useState)
↓
Custom hooks
↓
Global store
```

Recommended global store options:

* Zustand
* Nanostores

Example:

```
/stores
  authStore.ts
  claimStore.ts
```

Global state should store:

* authentication
* claim status
* AI analysis results

---

# 🪝 Custom Hooks

Custom hooks should encapsulate **reusable logic**.

Example:

```
/hooks
  useUploadImage.ts
  useClaimStatus.ts
  useDamageAnalysis.ts
```

Example hook:

```ts
export function useUploadImage() {
  const mutation = useMutation(uploadDamageImage);

  return mutation;
}
```

---

# 🎨 Tailwind CSS Best Practices

Follow consistent design patterns.

Use utility classes instead of custom CSS whenever possible.

Example:

```tsx
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
  Upload Image
</button>
```

Avoid inline styles.

---

### Extract Reusable UI Components

Examples:

```
PrimaryButton
InputField
Card
Modal
Badge
Loader
```

---

# 📷 Image Upload UX Guidelines

The claim submission interface must be **extremely clear and simple**.

Best practices:

* show image preview
* allow multiple image uploads
* show upload progress
* validate file types

Example:

```
Accepted formats: JPG, PNG
Max size: 10MB
```

---

# ⚡ Performance Best Practices

Frontend must remain fast and responsive.

Recommended practices:

* lazy load pages
* memoize heavy components
* avoid unnecessary re-renders

Example:

```tsx
const DamagePreview = React.memo(({ image }) => {
  return <img src={image} />;
});
```

---

# 🔐 Security Best Practices

Sensitive operations must follow strict security rules.

Frontend must:

* never store tokens in localStorage if avoidable
* sanitize user inputs
* validate file uploads
* enforce authentication guards

Example:

```
Protected routes for admin dashboard
```

---

# 📱 Responsive Design

The platform should support:

* mobile
* tablet
* desktop

Use Tailwind breakpoints.

Example:

```
sm:
md:
lg:
xl:
```

---

# 🧪 Testing Guidelines

Critical components must be testable.

Recommended tools:

* Vitest
* React Testing Library

Example test areas:

* image upload
* API interaction
* claim status rendering

---

# 🧹 Code Quality Rules

Follow these standards:

* use TypeScript types
* avoid large components
* remove unused code
* maintain consistent naming

---

# 🔄 UI Workflow Alignment

The frontend must reflect the **insurance claim processing pipeline**.

Typical flow:

```
User Login
↓
Upload Damage Image
↓
AI Damage Detection
↓
Cost Estimation
↓
Fraud Detection
↓
Claim Report Generated
↓
Admin Review
```

Each stage must have **clear UI feedback**.

---

# 🎯 UX Principles

The platform should emphasize:

* clarity
* transparency
* speed
* trust

Because insurance claims involve **financial decisions**, the UI must clearly show:

* AI analysis results
* cost estimates
* fraud warnings
* claim status

---

# 🚀 General Philosophy

Frontend code should prioritize:

* simplicity
* readability
* maintainability

Avoid unnecessary abstraction.

Prefer **clear and explicit code** over clever tricks.