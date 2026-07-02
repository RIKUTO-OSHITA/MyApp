## ADDED Requirements

### Requirement: Single-day scheduler timeline view
The system SHALL provide an Outlook-like single-day timeline view divided into 30-minute time slots.

#### Scenario: Open scheduler view
- **WHEN** the user opens the scheduler tool
- **THEN** the system displays one day timeline with 30-minute slot boundaries for the full day

#### Scenario: Maintain 30-minute granularity
- **WHEN** the timeline is rendered
- **THEN** every visible slot boundary corresponds to a 30-minute increment with no other granularity shown

### Requirement: Task creation with required fields
The system SHALL allow users to add a task using task name, start time, and end time fields only.

#### Scenario: Add valid task
- **WHEN** the user enters a task name, a start time, and an end time aligned to 30-minute slots where start time is earlier than end time and submits
- **THEN** the system creates the task and renders it in the corresponding timeline range

#### Scenario: Reject invalid task time range
- **WHEN** the user submits a task where start time is equal to or later than end time
- **THEN** the system rejects the submission and shows a validation error explaining the required time order

### Requirement: Task editing
The system SHALL allow users to edit an existing task's name, start time, and end time.

#### Scenario: Edit task details
- **WHEN** the user updates one or more editable fields of an existing task with valid values and saves
- **THEN** the system persists the updated task and refreshes its timeline position and displayed details

#### Scenario: Reject invalid edited values
- **WHEN** the user attempts to save edited task data that violates required field or time constraints
- **THEN** the system prevents saving and displays validation feedback

### Requirement: Task deletion
The system SHALL allow users to delete an existing task from the day schedule.

#### Scenario: Delete task
- **WHEN** the user confirms deletion of a selected task
- **THEN** the system removes the task from the schedule and timeline immediately

### Requirement: Cool-color visual theme
The system SHALL use a cool-color based, eye-friendly visual style for the scheduler interface.

#### Scenario: Render scheduler theme
- **WHEN** the scheduler view is displayed
- **THEN** the UI uses cool-toned colors for primary surfaces and accents while preserving text readability and clear task visibility
