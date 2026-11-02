from datetime import datetime, timezone
from typing import Literal
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.task import Task

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=240)
    description: str = ""
    priority: Literal["low", "medium", "high", "critical"] = "medium"
    domain: str = "personal"
    due_at: datetime | None = None


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=240)
    description: str | None = None
    priority: Literal["low", "medium", "high", "critical"] | None = None
    status: Literal["planned", "in_progress", "blocked", "completed", "cancelled"] | None = None
    domain: str | None = None
    due_at: datetime | None = None


class TaskRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    priority: str
    status: str
    domain: str
    due_at: datetime | None
    created_at: datetime
    completed_at: datetime | None


@router.get("", response_model=list[TaskRead])
def list_tasks(status: str | None = None, db: Session = Depends(get_db)):
    statement = select(Task).order_by(Task.created_at.desc())
    if status:
        statement = statement.where(Task.status == status)
    return list(db.scalars(statement).all())


@router.post("", response_model=TaskRead, status_code=201)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)):
    task = Task(**payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.patch("/{task_id}", response_model=TaskRead)
def update_task(task_id: int, payload: TaskUpdate, db: Session = Depends(get_db)):
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    changes = payload.model_dump(exclude_unset=True)
    for key, value in changes.items():
        setattr(task, key, value)
    if changes.get("status") == "completed":
        task.completed_at = datetime.now(timezone.utc)
    elif changes.get("status") and changes["status"] != "completed":
        task.completed_at = None
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
