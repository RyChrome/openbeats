import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { FilesService } from '../files/files.service';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly filesService: FilesService,
    private connection: Connection,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
  async getByGenre(genre: string) {
    const GenreList: unknown = await this.usersRepository.find({ genre });
    if (GenreList) {
      return GenreList;
    }
    throw new HttpException(
      'Users with this genre does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getByAge(age: number) {
    const ageList: unknown = await this.usersRepository.find({ age });
    if (ageList) {
      return ageList;
    }
    throw new HttpException(
      'Users with this genre does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: CreateUserDto) {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async addAvatar(userId: string, img: Express.Multer.File) {
    const user = await this.getByEmail(userId);
    if (user.avatar) {
      await this.usersRepository.update(userId, {
        ...user,
        avatar: null,
      });
      await this.filesService.deletePublicFile(user.avatar.id);
    }
    const avatar = await this.filesService.uploadPublicFile(img);
    await this.usersRepository.update(userId, {
      ...user,
      avatar,
    });
    return avatar;
  }
  async GetDetailsFName(userid: number) {
    const user = await this.getById(userid);
    return user.firstName;
  }
  async UpdateBio(userid: number, UserData: string) {
    const user = await this.getById(userid);
    user.bio = UserData;
    const bio = user.bio;
    await this.usersRepository.update(userid, {
      ...user,
      bio,
    });
  }
  async UpdateAge(userid: number, UserData: number) {
    const user = await this.getById(userid);
    user.age = UserData;
    const age = user.age;
    await this.usersRepository.update(userid, {
      ...user,
      age,
    });
  }

  async UpdateURL(userid: number, UserData: string) {
    const user = await this.getById(userid);
    user.url = UserData;
    const url = user.url;
    await this.usersRepository.update(userid, {
      ...user,
      url,
    });
  }

  async UpdateGenre(userid: number, UserData: string) {
    const user = await this.getById(userid);
    user.genre = UserData;
    const genre = user.genre;
    await this.usersRepository.update(userid, {
      ...user,
      genre,
    });
  }

  async UpdateCompany(userid: number, UserData: string) {
    const user = await this.getById(userid);
    user.company = UserData;
    const company = user.url;
    await this.usersRepository.update(userid, {
      ...user,
      company,
    });
  }

  async Updatefname(userid: number, UserData: string) {
    const user = await this.getById(userid);
    user.firstName = UserData;
    const firstName = user.firstName;
    await this.usersRepository.update(userid, {
      ...user,
      firstName,
    });
  }

  async Updatelname(userid: number, UserData: string) {
    const user = await this.getById(userid);
    user.lastName = UserData;
    const lastName = user.lastName;
    await this.usersRepository.update(userid, {
      ...user,
      lastName,
    });
  }

  async deleteAvatar(userId: number) {
    const queryRunner = this.connection.createQueryRunner();
    const user = await this.getById(userId);
    const fileId = user.avatar?.id;
    if (fileId) {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await queryRunner.manager.update(User, userId, {
          ...user,
          avatar: null,
        });
        await this.filesService.deletePublicFileWithQueryRunner(
          fileId,
          queryRunner,
        );
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException();
      } finally {
        await queryRunner.release();
      }
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, email: string) {
    const user = await this.getByEmail(email);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async deleteUserById(userId: number) {
    return this.usersRepository.delete(userId);
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async update(id: number, user: UpdateUserDto) {
    await this.usersRepository.update(id, user);
    const updatedUser = await this.usersRepository.findOne(id);
    if (updatedUser) {
      return updatedUser;
    }
    throw new HttpException(
      'User was not found in the database',
      HttpStatus.NOT_FOUND,
    );
  }
}
