export enum MedicalSpecialty {
  ALERGOLOGIA = "Alergologia",
  ANESTESIOLOGIA = "Anestesiologia",
  ANGIOLOGIA = "Angiologia",
  CANCEROLOGIA = "Cancerologia",
  CARDIOLOGIA = "Cardiologia",
  CIRURGIA_CARDIOVASCULAR = "Cirurgia Cardiovascular",
  CIRURGIA_CABECA_PESCOCO = "Cirurgia de Cabeça e Pescoço",
  CIRURGIA_DIGESTIVA = "Cirurgia do Aparelho Digestivo",
  CIRURGIA_GERAL = "Cirurgia Geral",
  CIRURGIA_PEDIATRICA = "Cirurgia Pediátrica",
  CIRURGIA_PLASTICA = "Cirurgia Plástica",
  CIRURGIA_TORACICA = "Cirurgia Torácica",
  CIRURGIA_VASCULAR = "Cirurgia Vascular",
  CLINICA_MEDICA = "Clínica Médica",
  DERMATOLOGIA = "Dermatologia",
  ENDOCRINOLOGIA = "Endocrinologia e Metabologia",
  ENDOSCOPIA = "Endoscopia",
  GASTROENTEROLOGIA = "Gastroenterologia",
  GERIATRIA = "Geriatria",
  GINECOLOGIA_OBSTETRICIA = "Ginecologia e Obstetrícia",
  HEMATOLOGIA = "Hematologia e Hemoterapia",
  HEPATOLOGIA = "Hepatologia",
  HOMEOPATIA = "Homeopatia",
  INFECTOLOGIA = "Infectologia",
  MASTOLOGIA = "Mastologia",
  MEDICINA_DE_EMERGENCIA = "Medicina de Emergência",
  MEDICINA_DO_ESPORTO = "Medicina do Esporte",
  MEDICINA_DO_TRABALHO = "Medicina do Trabalho",
  MEDICINA_DE_FAMILIA = "Medicina de Família e Comunidade",
  MEDICINA_FISICA_REABILITACAO = "Medicina Física e Reabilitação",
  MEDICINA_INTENSIVA = "Medicina Intensiva",
  MEDICINA_LEGAL = "Medicina Legal e Perícia Médica",
  NEFROLOGIA = "Nefrologia",
  NEUROCIRURGIA = "Neurocirurgia",
  NEUROLOGIA = "Neurologia",
  NUTROLOGIA = "Nutrologia",
  OFTALMOLOGIA = "Oftalmologia",
  ONCOLOGIA_CLINICA = "Oncologia Clínica",
  ORTOPEDIA_TRAUMATOLOGIA = "Ortopedia e Traumatologia",
  OTORRINOLARINGOLOGIA = "Otorrinolaringologia",
  PATOLOGIA = "Patologia",
  PATOLOGIA_CLINICA = "Patologia Clínica/Medicina Laboratorial",
  PEDIATRIA = "Pediatria",
  PNEUMOLOGIA = "Pneumologia",
  PSIQUIATRIA = "Psiquiatria",
  RADIOLOGIA = "Radiologia e Diagnóstico por Imagem",
  RADIOTERAPIA = "Radioterapia",
  REUMATOLOGIA = "Reumatologia",
  UROLOGIA = "Urologia",
}

export const medicalSpecialties = Object.entries(MedicalSpecialty).map(
  ([key, value]) => ({
    value: MedicalSpecialty[key as keyof typeof MedicalSpecialty],
    label: value,
  }),
);

export const weekDays = [
  { label: "Domingo", value: "0" },
  { label: "Segunda", value: "1" },
  { label: "Terça", value: "2" },
  { label: "Quarta", value: "3" },
  { label: "Quinta", value: "4" },
  { label: "Sexta", value: "5" },
  { label: "Sábado", value: "6" },
];

export const timeOptions = {
  Manhã: [
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
  ],
  Tarde: [
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
  ],
  Noite: [
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ],
};
