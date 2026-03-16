# User Flow

## 1. Actors

The system involves two primary actors:

**User (Policyholder)**
A vehicle owner submitting an insurance claim using the platform.

**Admin (Insurance Officer)**
A representative from the insurance company responsible for reviewing and approving claims.

---

# 2. User Claim Submission Flow

### Step 1 — User Accesses Platform

The user opens the web application using a browser or mobile device.

The system loads the **React-based responsive interface**.

---

### Step 2 — User Authentication

The user logs in or registers.

Authentication is handled through the backend using **secure API authentication**.

---

### Step 3 — Upload Vehicle Damage Images

The user uploads one or more images of the damaged vehicle.

The system validates:

* image format
* file size
* upload integrity

Images are stored securely in **cloud storage (S3)**.

---

### Step 4 — Image Processing Begins

The backend triggers the AI processing pipeline.

Images are sent to the **image preprocessing module** where operations such as:

* resizing
* noise reduction
* region extraction

are applied.

---

### Step 5 — Damage Detection

The processed image is analyzed by the **damage detection model**.

The AI model identifies:

* location of damage
* type of damage
* severity level

---

### Step 6 — Repair Cost Estimation

Based on the detected damage, the **cost prediction model** estimates the repair cost.

This prediction considers:

* damage severity
* damage location
* historical repair cost data

---

### Step 7 — Fraud Detection

The system performs fraud verification using:

* duplicate image detection
* perceptual hashing
* metadata validation
* anomaly detection

A **fraud risk score** is generated.

---

### Step 8 — Claim Report Generation

A **Generative AI module** produces a structured claim report including:

* damage summary
* repair estimate
* supporting analysis

The report is stored in the database.

---

### Step 9 — User Receives Claim Summary

The user receives a summary including:

* detected damage
* estimated repair cost
* claim report preview
* claim status

---

# 3. Admin Review Flow

### Step 10 — Admin Accesses Dashboard

Insurance administrators access the **Admin Dashboard**.

They can view:

* submitted claims
* AI damage reports
* fraud detection alerts

---

### Step 11 — Claim Evaluation

The admin reviews:

* uploaded images
* AI damage analysis
* fraud risk indicators
* cost estimation results

---

### Step 12 — Claim Approval or Rejection

The admin can:

* approve the claim
* reject the claim
* request additional information

The final decision is stored in the system.

---

# 4. Final Outcome

Once approved:

* the claim is finalized
* payment processing can begin
* the user is notified of the claim decision