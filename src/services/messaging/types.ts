import type { UserInfo } from "../master-data/user/types";
import type { Request } from "../request/types";
import type { Task } from "../task/task-management";

export interface Messaging {
    content : string;
    creator: UserInfo
    file_name: string;
    file_path: string;
    id: number;
    request: Request
    task: Task
}