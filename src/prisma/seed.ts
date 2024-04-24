// Sources
import { PrismaClient, loanState } from '@prisma/client';
import { LoanStates } from '../common/enums';

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

}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		await prisma.$disconnect();
		process.exit(1);
	});