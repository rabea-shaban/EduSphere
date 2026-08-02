"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDefaultData = void 0;
const grade_model_1 = __importDefault(require("../modules/grades/grade.model"));
const term_model_1 = __importDefault(require("../modules/terms/term.model"));
const user_model_1 = __importDefault(require("../modules/users/user.model"));
/**
 * Auto-seeds default Grades, Terms, and initial Super Admin user if not present.
 */
const seedDefaultData = async () => {
    try {
        // 1. Seed Grades
        const gradeCount = await grade_model_1.default.countDocuments();
        if (gradeCount === 0) {
            console.log('[Seeder] Grades collection is empty. Seeding default grades...');
            const defaultGrades = [
                {
                    name: { ar: 'الصف الرابع الابتدائي', en: 'Grade 4' },
                    order: 4,
                    educationStage: 'Primary',
                    description: 'Fourth Grade of Primary School',
                },
                {
                    name: { ar: 'الصف الخامس الابتدائي', en: 'Grade 5' },
                    order: 5,
                    educationStage: 'Primary',
                    description: 'Fifth Grade of Primary School',
                },
                {
                    name: { ar: 'الصف السادس الابتدائي', en: 'Grade 6' },
                    order: 6,
                    educationStage: 'Primary',
                    description: 'Sixth Grade of Primary School',
                },
                {
                    name: { ar: 'الصف الأول الإعدادي', en: 'Grade 7' },
                    order: 7,
                    educationStage: 'Preparatory',
                    description: 'First Grade of Preparatory School',
                },
                {
                    name: { ar: 'الصف الثاني الإعدادي', en: 'Grade 8' },
                    order: 8,
                    educationStage: 'Preparatory',
                    description: 'Second Grade of Preparatory School',
                },
                {
                    name: { ar: 'الصف الثالث الإعدادي', en: 'Grade 9' },
                    order: 9,
                    educationStage: 'Preparatory',
                    description: 'Third Grade of Preparatory School',
                },
                {
                    name: { ar: 'الصف الأول الثانوي', en: 'Grade 10' },
                    order: 10,
                    educationStage: 'Secondary',
                    description: 'First Grade of Secondary School',
                },
                {
                    name: { ar: 'الصف الثاني الثانوي', en: 'Grade 11' },
                    order: 11,
                    educationStage: 'Secondary',
                    description: 'Second Grade of Secondary School',
                },
                {
                    name: { ar: 'الصف الثالث الثانوي', en: 'Grade 12' },
                    order: 12,
                    educationStage: 'Secondary',
                    description: 'Third Grade of Secondary School',
                },
            ];
            await grade_model_1.default.insertMany(defaultGrades);
            console.log('[Seeder] Grades seeded successfully.');
        }
        else {
            console.log('[Seeder] Grades collection already has data. Skipping grades seeding.');
        }
        // 2. Seed Terms
        const termCount = await term_model_1.default.countDocuments();
        if (termCount === 0) {
            console.log('[Seeder] Terms collection is empty. Seeding default terms...');
            const defaultTerms = [
                { name: 'First Term', order: 1, isActive: true },
                { name: 'Second Term', order: 2, isActive: true },
            ];
            await term_model_1.default.insertMany(defaultTerms);
            console.log('[Seeder] Terms seeded successfully.');
        }
        else {
            console.log('[Seeder] Terms collection already has data. Skipping terms seeding.');
        }
        // 3. Seed Super Admin Account
        const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || 'superadmin@edusphere.app').toLowerCase();
        const existingSuperAdmin = await user_model_1.default.findOne({
            $or: [{ role: 'SUPER_ADMIN' }, { email: superAdminEmail }],
        });
        if (!existingSuperAdmin) {
            console.log('[Seeder] Super Admin account not found. Seeding initial Super Admin...');
            const firstName = process.env.SUPER_ADMIN_FIRST_NAME || 'Super';
            const lastName = process.env.SUPER_ADMIN_LAST_NAME || 'Admin';
            const username = (process.env.SUPER_ADMIN_USERNAME || 'superadmin').toLowerCase();
            const password = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123456';
            const phone = process.env.SUPER_ADMIN_PHONE || '+10000000000';
            await user_model_1.default.create({
                firstName,
                lastName,
                username,
                email: superAdminEmail,
                password,
                phone,
                role: 'SUPER_ADMIN',
                isVerified: true,
            });
            console.log(`[Seeder] Super Admin account created successfully: ${superAdminEmail}`);
        }
        else {
            console.log('[Seeder] Super Admin account already exists. Skipping super admin seeding.');
        }
    }
    catch (error) {
        console.error('[Seeder] Error during database seeding:', error);
    }
};
exports.seedDefaultData = seedDefaultData;
