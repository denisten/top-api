import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { disconnect, Types } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { USER_NOT_FOUND, WRONG_PASSWORD } from '../src/auth/auth.constants';

const loginDto: AuthDto = {
	login: 'denisten@list.ru',
	password: '123'
}

describe('Auth (e2e)', () => {
	let app: INestApplication;
	let createdId: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/login (POST) - success', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.access_token).toBeDefined();
			});
	});


	it('/auth/login (POST) - fail by wrong login', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, login: 'wrongLogin@mail.ru' })
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(USER_NOT_FOUND);
			});
	});



	it('/auth/login (POST) - fail by wrong password', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, password: 'wrongPassword' })
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(WRONG_PASSWORD);
			});
	});

	afterAll(() => {
		disconnect();
	});
});
