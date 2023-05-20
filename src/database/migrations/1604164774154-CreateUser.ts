import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1604164774154 implements MigrationInterface {
  name = 'CreateUser1604164774154';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        create table file
        (
            id         SERIAL PRIMARY KEY,
            path       VARCHAR                 NOT NULL,
            created_at TIMESTAMP DEFAULT now() NOT NULL,
            updated_at TIMESTAMP DEFAULT now() NOT NULL
        );
        
        create table role
        (
            id   SERIAL PRIMARY KEY,
            name VARCHAR NOT NULL
        );
        
        create table status
        (
            id   SERIAL PRIMARY KEY,
            name VARCHAR NOT NULL
        );
        
        create table "user"
        (
            id         SERIAL PRIMARY KEY,
            email      VARCHAR                 NOT NULL,
            password   VARCHAR,
            first_name VARCHAR,
            last_name  VARCHAR,
            hash       VARCHAR,
            created_at TIMESTAMP DEFAULT now() NOT NULL,
            updated_at TIMESTAMP DEFAULT now() NOT NULL,
            deleted_at timestamp,
            file_id    INTEGER REFERENCES file (id),
            role_id    INTEGER REFERENCES role (id),
            status_id  INTEGER REFERENCES status (id),
            CONSTRAINT "uq_user_email" UNIQUE ("email")
        );
        
        create table forgot
        (
            id         SERIAL PRIMARY KEY,
            hash       VARCHAR                 NOT NULL,
            created_at TIMESTAMP DEFAULT now() NOT NULL,
            updated_at TIMESTAMP DEFAULT now() NOT NULL,
            user_id    INTEGER REFERENCES public.user (id)
        );
        
        CREATE TABLE service_category
        (
            id          SERIAL PRIMARY KEY,
            name        VARCHAR(255)            NOT NULL,
            description TEXT,
            created_at  TIMESTAMP DEFAULT now() NOT NULL,
            updated_at  TIMESTAMP DEFAULT now() NOT NULL
        );
        
        CREATE TABLE service
        (
            id          SERIAL PRIMARY KEY,
            user_id     INTEGER REFERENCES public.user (id),
            category    INTEGER REFERENCES service_category (id),
            title       VARCHAR(255)            NOT NULL,
            description TEXT,
            price       NUMERIC                 NOT NULL,
            location    VARCHAR(255)            NOT NULL,
            created_at  TIMESTAMP DEFAULT now() NOT NULL,
            updated_at  TIMESTAMP DEFAULT now() NOT NULL
        );
        
        
        CREATE TABLE booking
        (
            id         SERIAL PRIMARY KEY,
            user_id    INTEGER REFERENCES public.user (id),
            service_id INTEGER REFERENCES service (id),
            date_time  TIMESTAMP               NOT NULL,
            status     VARCHAR(255)            NOT NULL,
            created_at TIMESTAMP DEFAULT now() NOT NULL,
            updated_at TIMESTAMP DEFAULT now() NOT NULL
        );
        
        CREATE TABLE review
        (
            id         SERIAL PRIMARY KEY,
            user_id    INTEGER REFERENCES public.user (id),
            service_id INTEGER REFERENCES service (id),
            rating     INTEGER CHECK (rating >= 1 AND rating <= 5),
            comment    TEXT,
            created_at TIMESTAMP DEFAULT now() NOT NULL
        );
        
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "forgot"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "status"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "file"`);
  }
}
