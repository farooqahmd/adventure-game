from typing import List, Optional, Dict
from datetime import datetime
from pydantic import BaseModel

class StoryOptionsSchema(BaseModel):
    text: str
    node_id: Optional[int] = None

    
class StoryNodeBase(BaseModel):
    content: str
    is_ending: bool = False
    is_winning_ending: bool = False

class CompleteStoryNodeResponse(StoryNodeBase):
    id: int
    is_root: bool = False
    options: List[StoryOptionsSchema] = []

    class Config:
        from_attributes = True

class StoryBase(BaseModel):
    title: Optional[str] = None  # ✅ make optional

    class Config:
        from_attributes = True

class CreateStoryRequest(StoryBase):
    theme: str  # only theme is required from frontend


class CompleteStoryResponse(StoryBase):
    id: int
    created_at: datetime
    session_id: Optional[str] = None
    root_node: Optional[CompleteStoryNodeResponse] = None
    all_nodes: Dict[int, CompleteStoryNodeResponse] 

    class Config:
        from_attributes = True

class StoryNodeLLM(BaseModel):
    content: str
    isEnding: bool = False
    isWinningEnding: bool = False
    options: Optional[List["StoryOptionLLM"]] = []

class StoryOptionLLM(BaseModel):
    text: str
    nextNode: StoryNodeLLM

StoryNodeLLM.model_rebuild()  # needed for self-referencing model

class StoryLLMResponse(BaseModel):
    title: str
    root_node: StoryNodeLLM