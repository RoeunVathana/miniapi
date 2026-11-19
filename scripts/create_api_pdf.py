from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageTemplate,
    PageBreak,
    Paragraph,
    Preformatted,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "minishopstore-api-guide.pdf"

NAVY = colors.HexColor("#17324D")
TEAL = colors.HexColor("#0F766E")
LIGHT_TEAL = colors.HexColor("#E6FFFB")
LIGHT_BLUE = colors.HexColor("#EEF5FB")
LIGHT_GRAY = colors.HexColor("#F4F6F8")
MID_GRAY = colors.HexColor("#64748B")
DARK = colors.HexColor("#17202A")


class ApiDocTemplate(BaseDocTemplate):
    def __init__(self, filename, **kwargs):
        super().__init__(filename, **kwargs)
        frame = Frame(
            self.leftMargin,
            self.bottomMargin,
            self.width,
            self.height,
            id="normal",
        )
        self.addPageTemplates(
            [PageTemplate(id="api", frames=frame, onPage=draw_page_chrome)]
        )


def draw_page_chrome(canvas, document):
    canvas.saveState()
    page_width, page_height = A4
    canvas.setStrokeColor(colors.HexColor("#D8E1E8"))
    canvas.setLineWidth(0.5)
    canvas.line(document.leftMargin, page_height - 18 * mm, page_width - document.rightMargin, page_height - 18 * mm)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.setFillColor(NAVY)
    canvas.drawString(document.leftMargin, page_height - 13 * mm, "MINISHOPSTORE API GUIDE")
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MID_GRAY)
    canvas.drawRightString(page_width - document.rightMargin, 11 * mm, f"Page {document.page}")
    canvas.restoreState()


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="CoverTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=28,
        leading=33,
        textColor=NAVY,
        alignment=TA_CENTER,
        spaceAfter=10,
    )
)
styles.add(
    ParagraphStyle(
        name="CoverSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=13,
        leading=18,
        textColor=TEAL,
        alignment=TA_CENTER,
        spaceAfter=18,
    )
)
styles.add(
    ParagraphStyle(
        name="H1Custom",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=NAVY,
        spaceBefore=12,
        spaceAfter=8,
        keepWithNext=True,
    )
)
styles.add(
    ParagraphStyle(
        name="H2Custom",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=15,
        textColor=TEAL,
        spaceBefore=9,
        spaceAfter=5,
        keepWithNext=True,
    )
)
styles.add(
    ParagraphStyle(
        name="BodyCustom",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=14,
        textColor=DARK,
        spaceAfter=7,
    )
)
styles.add(
    ParagraphStyle(
        name="SmallCustom",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=MID_GRAY,
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="TableHeader",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=colors.white,
    )
)
styles.add(
    ParagraphStyle(
        name="TableCell",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=7.7,
        leading=10,
        textColor=DARK,
    )
)
styles.add(
    ParagraphStyle(
        name="CodeCustom",
        parent=styles["Code"],
        fontName="Courier",
        fontSize=7.3,
        leading=10,
        textColor=colors.HexColor("#D6E7F5"),
        leftIndent=0,
        rightIndent=0,
        spaceAfter=0,
    )
)


def p(text, style="BodyCustom"):
    return Paragraph(text, styles[style])


def code(text):
    table = Table([[Preformatted(text.strip("\n"), styles["CodeCustom"])]], colWidths=[170 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#1F2937")),
                ("BOX", (0, 0), (-1, -1), 0, colors.HexColor("#1F2937")),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return table


def bullet(text):
    return p(f"<font color='{TEAL}'>-</font> {text}")


def make_table(headers, rows, widths):
    data = [[p(header, "TableHeader") for header in headers]]
    data.extend([[p(str(cell), "TableCell") for cell in row] for row in rows])
    table = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), NAVY),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#CBD5E1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT_BLUE]),
            ]
        )
    )
    return table


def build_story():
    story = []
    story.extend(
        [
            Spacer(1, 20 * mm),
            p("MiniShopStore API", "CoverTitle"),
            p("NestJS teaching and testing guide", "CoverSubtitle"),
            Table(
                [[p("Products", "H2Custom"), p("Users", "H2Custom"), p("Security", "H2Custom")],
                 [p("CRUD catalog API", "TableCell"), p("Registration and management", "TableCell"), p("Helmet, throttling, CORS", "TableCell")]],
                colWidths=[55 * mm, 55 * mm, 60 * mm],
                style=TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, -1), LIGHT_TEAL),
                        ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#99D5CE")),
                        ("INNERGRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#B8E3DE")),
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("LEFTPADDING", (0, 0), (-1, -1), 9),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                        ("TOPPADDING", (0, 0), (-1, -1), 8),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                    ]
                ),
            ),
            Spacer(1, 13 * mm),
            p("A practical reference for learning NestJS modules, controllers, services, DTO validation, HTTP testing, and introductory API security.", "BodyCustom"),
            Spacer(1, 4 * mm),
            p("The project uses PostgreSQL through Prisma. A migration and seed script make the database easy to inspect in pgAdmin.", "SmallCustom"),
            Spacer(1, 4 * mm),
            p("Production URL: https://miniapi-production-3e1bc0d9.up.railway.app/api", "SmallCustom"),
            Spacer(1, 17 * mm),
            p("Base URL", "H2Custom"),
            code("http://localhost:3000/api"),
            Spacer(1, 9 * mm),
            p("Project commands", "H2Custom"),
            code("npm install\nnpm run start:dev\nnpm test\nnpm run build"),
            Spacer(1, 12 * mm),
            p("Generated from the MiniShopStore NestJS project", "SmallCustom"),
        ]
    )

    story.extend([PageBreak(), p("1. Quick start", "H1Custom")])
    story.extend(
        [
            p("Install dependencies and start the development server. The API will listen on port 3000 unless PORT is changed.", "BodyCustom"),
            code("npm install\nnpm run start:dev"),
            p("Health check:", "H2Custom"),
            code("GET http://localhost:3000/api/health"),
            p("The seeded API returns three products and two users. The request examples in requests.http can be opened in VS Code with a REST client extension.", "BodyCustom"),
            p("For local setup, create a database named minishopstore in pgAdmin, set DATABASE_URL in .env, then run the migration and seed commands.", "BodyCustom"),
            p("The OpenAPI JSON file is docs/minishopstore-api.json. Import it into Swagger UI or Postman. The API is configured with public CRUD routes for classroom testing.", "BodyCustom"),
            p("Deployment client settings:", "H2Custom"),
            code('{"baseUrl":"https://miniapi-production-3e1bc0d9.up.railway.app/api",\n'
                 ' "healthUrl":"https://miniapi-production-3e1bc0d9.up.railway.app/api/health"}'),
        ]
    )

    story.extend([p("2. Security baseline", "H1Custom")])
    security_rows = [
        ("Helmet", "Adds common HTTP security headers."),
        ("Throttling", "Limits each client to 100 requests per minute."),
        ("Body size", "Rejects JSON and form bodies over 100 KB."),
        ("CORS", "Allows only origins listed in CORS_ORIGINS."),
        ("Public writes", "Keeps classroom testing simple; add authentication before production."),
        ("Registration", "Always creates an active customer; no self-assigned admin role."),
    ]
    story.append(make_table(["Protection", "What it does"], security_rows, [38 * mm, 132 * mm]))
    story.extend(
        [
            Spacer(1, 4 * mm),
            p("Before production, add JWT or session authentication and database-backed authorization. Keep a real CORS_ORIGINS value configured.", "BodyCustom"),
        ]
    )

    story.extend([p("3. Endpoint reference", "H1Custom")])
    endpoint_rows = [
        ("GET", "/api/health", "Public", "Service status"),
        ("GET", "/api/products", "Public", "List or filter products"),
        ("GET", "/api/products/:id", "Public", "Get one product"),
        ("POST", "/api/products", "Public", "Create a product"),
        ("PATCH", "/api/products/:id", "Public", "Update a product"),
        ("DELETE", "/api/products/:id", "Public", "Delete a product"),
        ("GET", "/api/users", "Public", "List or filter users"),
        ("GET", "/api/users/:id", "Public", "Get one user"),
        ("POST", "/api/users", "Public", "Register a customer"),
        ("PATCH", "/api/users/:id", "Public", "Update a user"),
        ("DELETE", "/api/users/:id", "Public", "Delete a user"),
    ]
    story.append(make_table(["Method", "Route", "Auth", "Purpose"], endpoint_rows, [18 * mm, 58 * mm, 30 * mm, 64 * mm]))

    story.extend([p("4. JSON keys and request process", "H1Custom")])
    story.extend(
        [
            p("Every POST and PATCH request uses Content-Type: application/json. Send only the documented keys. Extra keys are rejected so students can see DTO validation clearly.", "BodyCustom"),
            p("Product insert: POST /api/products", "H2Custom"),
            make_table(
                ["Key", "Type", "Required", "Rules"],
                [
                    ("name", "string", "Yes", "2-100 characters"),
                    ("description", "string", "No", "Maximum 500 characters"),
                    ("price", "number", "Yes", "0-1,000,000; max 2 decimals"),
                    ("category", "string", "Yes", "2-50 characters"),
                    ("stock", "integer", "Yes", "0-1,000,000"),
                    ("imageUrl", "URL string", "No", "Must be a valid URL"),
                ],
                [32 * mm, 35 * mm, 25 * mm, 78 * mm],
            ),
            p("Product POST, PATCH, and DELETE are public in this classroom configuration. Do not send id, createdAt, or updatedAt in an insert body.", "SmallCustom"),
            p("User insert: POST /api/users", "H2Custom"),
            make_table(
                ["Key", "Type", "Required", "Rules"],
                [
                    ("name", "string", "Yes", "2-100 characters"),
                    ("email", "email string", "Yes", "Valid and unique email"),
                ],
                [32 * mm, 35 * mm, 25 * mm, 78 * mm],
            ),
            p("Public registration lowercases the email, sets role to customer, and sets isActive to true. Do not send role, isActive, id, createdAt, or updatedAt when registering.", "SmallCustom"),
            p("User update: PATCH /api/users/:id", "H2Custom"),
            code('{"name":"Updated Student","email":"updated@example.com",\n'
                 ' "role":"customer","isActive":true}'),
            p("Query and path keys", "H2Custom"),
            make_table(
                ["Location", "Key", "Example", "Meaning"],
                [
                    ("Path", "id", "/products/1", "Numeric record ID"),
                    ("Query", "category", "/products?category=home", "Filter products"),
                    ("Query", "role", "/users?role=admin", "Filter users"),
                ],
                [27 * mm, 31 * mm, 57 * mm, 55 * mm],
            ),
            p("Request process: choose the method and route, add /api, add the JSON header, send documented keys, then check the status code. 200 means read/update/delete succeeded, 201 means insert succeeded, 400 means validation failed, 404 means the record was not found, and 409 means the email is already used.", "BodyCustom"),
            p("Common 400 response:", "H2Custom"),
            code('{"statusCode":400,"error":"Bad Request",\n'
                 ' "message":"Validation failed",\n'
                 ' "details":[{"field":"email",\n'
                 ' "messages":["email must be an email"]}]}'),
        ]
    )

    story.extend([p("5. Request examples", "H1Custom"), p("Create a product:", "H2Custom")])
    story.append(
        code(
            "POST /api/products\n"
            "Content-Type: application/json\n\n"
            '{"name":"Mechanical Keyboard","price":79.99,\n'
            ' "category":"electronics","stock":15}'
        )
    )
    story.extend([p("Register a customer:", "H2Custom")])
    story.append(
        code(
            "POST /api/users\n"
            "Content-Type: application/json\n\n"
            '{"name":"Bob Student","email":"bob@example.com"}'
        )
    )
    story.extend([p("Update a user:", "H2Custom")])
    story.append(
        code(
            "PATCH /api/users/1\n"
            "Content-Type: application/json\n\n"
            '{"isActive":false,"role":"customer"}'
        )
    )

    story.extend([p("6. Suggested student lesson", "H1Custom")])
    lesson_rows = [
        ("1", "main.ts and app.setup.ts", "Global prefix, Helmet, CORS, validation"),
        ("2", "ProductsController", "Routes, params, query, request bodies"),
        ("3", "ProductsService", "Business logic and Prisma queries"),
        ("4", "DTO files", "Validation rules and HTTP 400 responses"),
        ("5", "Public CRUD routes", "HTTP methods and classroom testing"),
        ("6", "app.e2e-spec.ts", "Automated API behavior tests"),
    ]
    story.append(make_table(["Step", "File or topic", "Learning goal"], lesson_rows, [15 * mm, 65 * mm, 90 * mm]))

    story.extend(
        [
            p("7. Production roadmap", "H1Custom"),
            bullet("Use PostgreSQL through Prisma and inspect the tables with pgAdmin."),
            bullet("Add JWT or session authentication."),
            bullet("Hash passwords with a password-hashing library; never store plain passwords."),
            bullet("Use database-backed roles and authorization rules."),
            bullet("Store secrets in a secret manager and enforce HTTPS."),
            bullet("Add audit logging and monitoring for administrative actions."),
        ]
    )
    return story


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    document = ApiDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=25 * mm,
        bottomMargin=18 * mm,
        title="MiniShopStore API Guide",
        author="MiniShopStore",
    )
    document.build(build_story())
    print(OUTPUT)


if __name__ == "__main__":
    main()
