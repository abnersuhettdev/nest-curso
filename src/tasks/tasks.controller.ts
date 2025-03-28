import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Get()
  getTaskts() {
    return this.tasksService.listAllTasks();
  }

  @Get('/teste')
  getOneTask() {
    return this.tasksService.findOneTask();
  }
}
