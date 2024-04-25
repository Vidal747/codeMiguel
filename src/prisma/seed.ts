// Sources
import { PrismaClient, loanState } from '@prisma/client';
import { LoanStates,TypeDocuments,TypePhones, MovieGenre, FilmState } from '../common/enums';

const prisma = new PrismaClient();

async function main() {
	// LoanState
	const loanState: Record<LoanStates, loanState> | Object = {};
	await Promise.all(
		Object.values(LoanStates).map(async (state) => {
			const result = await prisma.loanState.upsert({
				where: { name: state },
				update: {},
				create: { name: state },
			});
			loanState[state] = result;
		})
	);

	

	await Promise.all(
		Object.values(TypePhones).map(async (state) => {
			const result = await prisma.typePhone.upsert({
				where: { name: state },
				update: {},
				create: { name: state },
			})
		})
	);
	await Promise.all(
		Object.values(TypeDocuments).map(async (state) => {
			const result = await prisma.typeDocument.upsert({
				where: { name: state },
				update: {},
				create: { name: state },
			})
		})
	);
	await Promise.all(
		Object.values(MovieGenre).map(async (state) => {
			const result = await prisma.genre.upsert({
				where: { name: state },
				update: {},
				create: { name: state },
			})
		})
	);

	await Promise.all(
		Object.values(FilmState).map(async (state) => {
			const result = await prisma.filmState.upsert({
				where: { name: state },
				update: {},
				create: { name: state },
			})
		})
	);
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		await prisma.$disconnect();
		process.exit(1);
	});