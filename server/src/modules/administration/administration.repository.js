export default class AdministrationRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async create(data) {
    return this.prisma.administration.create({ data });
  }

  async findAll() {
    return this.prisma.administration.findMany({ where: { isDeleted: false } });
  }

  async findById(id) {
    return this.prisma.administration.findUnique({ where: { id } });
  }

  async findByEmail(email) {
    return this.prisma.administration.findUnique({ where: { email } });
  }

  async findByMatricule(matricule) {
    return this.prisma.administration.findUnique({ where: { matricule } });
  }

  async update(id, data) {
    return this.prisma.administration.update({ where: { id }, data });
  }

  async softDelete(id) {
    return this.prisma.administration.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
