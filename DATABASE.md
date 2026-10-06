# DATABASE.md — StartGuard AI Database Schema & Persistence

StartGuard AI uses a lightweight, self-contained SQLite relational database located in the backend folder.

---

## 1. Database Configuration

- **Database Engine**: SQLite 3
- **ORM / Driver**: SQLAlchemy 2.0 (`create_engine`, `declarative_base`, `sessionmaker`)
- **Database File**: `backend/database/bizguard.db`
- **Configuration Module**: `backend/database/db.py`
- **Connection URL**: `sqlite:///backend/database/bizguard.db`
- **Multi-thread flag**: `connect_args={"check_same_thread": False}`

---

## 2. Tables & Schema

### Table: `analysis_history`

Tracks all historical company predictions, health scores, risk levels, and full snapshot results.

| Column Name | SQL Type | Nullable | Primary Key | Indexed | Description |
|---|---|---|---|---|---|
| `id` | `String(64)` | No | **Yes** | **Yes** | Unique identifier (e.g. UUID string or timestamp hash) |
| `timestamp` | `DateTime` | Yes | No | No | UTC timestamp of the analysis generation (defaults to `datetime.utcnow`) |
| `company_name` | `String(128)`| Yes | No | **Yes** | Business / company legal name |
| `industry` | `String(128)`| Yes | No | No | Vertical or industry classification |
| `failure_probability` | `Float` | Yes | No | No | Raw model probability between `0.0` and `1.0` |
| `failure_probability_percent` | `Float` | Yes | No | No | Scaled failure percentage between `0.0` and `100.0` |
| `risk_level` | `String(32)` | Yes | No | No | Category: `'LOW RISK'`, `'MODERATE RISK'`, or `'HIGH RISK'` |
| `risk_color` | `String(16)` | Yes | No | No | Visual indicator: `'green'`, `'yellow'`, or `'red'` |
| `health_score` | `Integer` | Yes | No | No | Solvency health score between `0` and `100` |
| `health_status` | `String(64)` | Yes | No | No | Descriptive health status text |
| `payload_json` | `Text` | Yes | No | No | Serialized JSON string containing the complete `AnalysisResult` (ratios, SHAP values, recommendations, raw inputs) |

---

## 3. Database Operations & Helper Methods

All queries and mutations are encapsulated in `backend/database/db.py`:

### `save_analysis_record(analysis_dict: dict) -> None`
- Creates a new `AnalysisRecord` instance.
- Serializes `analysis_dict` into `payload_json`.
- Commits to SQLite.
- Handles exceptions by printing error logs and triggering `db.rollback()`.
- Closes the session in a `finally` block.

### `get_recent_analyses(limit: int = 15) -> List[dict]`
- Queries `AnalysisRecord` ordered by `AnalysisRecord.timestamp.desc()`.
- Limits results to the specified integer (default: 15).
- Deserializes `r.payload_json` back into native Python dictionaries.
- Closes the session in a `finally` block.

---

## 4. Client-Side Browser Storage (`localStorage`)

In addition to SQLite, the frontend persists user preferences and custom additions locally in the browser:

| Key | Storage | Description |
|---|---|---|
| `startguard_companies` | `localStorage` | Serialized JSON array of custom companies created by the user via `CreateCompanyModal.tsx` |
| `sg_theme` | `localStorage` | Active visual mode: `'light'` or `'dark'` |
