// Sources
import { Gender, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { Entities, Genders, Roles } from '../common/enums';

const prisma = new PrismaClient();

async function main() {
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		await prisma.$disconnect();
		process.exit(1);
	});
