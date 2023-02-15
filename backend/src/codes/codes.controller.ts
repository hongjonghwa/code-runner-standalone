import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { CodesService } from './codes.service'
import { CreateCodeDto } from './dto/create-code.dto'
import { UpdateCodeDto } from './dto/update-code.dto'
import { Access } from './entities/access.entity'

@Controller('codes')
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

  // key 생성
  @Post()
  create(@Body() dto: CreateCodeDto) {
    const access: Access = {
      accountId: dto.a,
      templateId: dto.t,
      problemId: dto.p,
      sessionId: dto.s,
    }
    return this.codesService.createAccess(access)
  }

  // 문제 정보 받아옴
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.codesService.findOne(+id)
  }

  // 문제 가져옴.
  @Get()
  findAll() {
    return this.codesService.findAll()
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCodeDto: UpdateCodeDto) {
    return this.codesService.update(+id, updateCodeDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.codesService.remove(+id)
  }
}
