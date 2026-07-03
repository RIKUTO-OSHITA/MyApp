## MODIFIED Requirements

### Requirement: Task creation with required fields
The system SHALL allow users to add a task using task name, start time, and end time fields, where start time and end time are chosen from a combined time (hour and minute together) dropdown restricted to 15-minute-aligned values within the scheduler's day range. The 30-minute timeline grid used to render the day view is unaffected by this 15-minute selection granularity.

#### Scenario: Add valid task
- **WHEN** the user enters a task name, selects a start time from the start time dropdown, selects an end time from the end time dropdown, and submits
- **THEN** the system creates the task and renders it in the corresponding timeline range

#### Scenario: End time options follow the selected start time
- **WHEN** the user selects or changes the start time in the dropdown
- **THEN** the end time dropdown offers only time options that are later than the selected start time

#### Scenario: Reject invalid task time range
- **WHEN** a task is submitted with a start time equal to or later than its end time
- **THEN** the system rejects the submission and shows a validation error explaining the required time order

### Requirement: Task editing
The system SHALL allow users to edit an existing task's name, start time, and end time, where start time and end time are chosen from the same combined time dropdowns used for task creation.

#### Scenario: Edit task details
- **WHEN** the user opens an existing task for editing, changes one or more of the name, start time dropdown selection, or end time dropdown selection to valid values, and saves
- **THEN** the system persists the updated task and refreshes its timeline position and displayed details

#### Scenario: Edit dialog preselects existing values
- **WHEN** the user opens an existing task for editing
- **THEN** the start time and end time dropdowns are preselected to the task's current start time and end time

#### Scenario: Reject invalid edited values
- **WHEN** the user attempts to save edited task data that violates required field or time constraints
- **THEN** the system prevents saving and displays validation feedback

## ADDED Requirements

### Requirement: Combined time dropdown option range
The system SHALL populate the start time and end time dropdowns with a single source-of-truth list of times spanning the scheduler's day range (07:30–18:00) in 15-minute increments, with no option outside that range or granularity.

#### Scenario: Dropdown options match the day range
- **WHEN** the task dialog is opened
- **THEN** both the start time and end time dropdowns list only times from 07:30 through 18:00 in 15-minute increments

### Requirement: Timeline grid granularity is independent of time selection granularity
The system SHALL continue to render the day timeline grid in 30-minute increments regardless of the 15-minute time selection granularity, and SHALL position a task on the timeline proportionally to its selected start and end times even when those times fall between 30-minute grid lines.

#### Scenario: Task starting between grid lines renders at the correct proportional position
- **WHEN** a task is created or edited with a start time or end time that is not aligned to the 30-minute grid (e.g. 08:15)
- **THEN** the timeline grid still shows rows only at 30-minute boundaries, and the task block is rendered starting or ending at the proportional position corresponding to its actual time
