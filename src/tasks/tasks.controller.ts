import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { LoggerInterceptor } from 'src/common/interceptors/logger.interceptor';
import { BodyCreateTaskInterceptor } from 'src/common/interceptors/body-create-task.interceptors';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { AuthAdminGuard } from 'src/common/guards/admin.guard';
@Controller('tasks')
// @UseGuards(AuthAdminGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseInterceptors(AddHeaderInterceptor)
  @UseInterceptors(LoggerInterceptor)
  @UseGuards(AuthAdminGuard)
  findAllTasks(@Query() paginationDto: PaginationDto) {
    return this.tasksService.findAll(paginationDto);
  }

  @Get(':id')
  findOneTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Post('/create')
  @UseInterceptors(BodyCreateTaskInterceptor)
  createTask(@Body() createBodyDto: CreateTaskDto) {
    return this.tasksService.create(createBodyDto);
  }

  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.delete(id);
  }
}
