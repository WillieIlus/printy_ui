export type SharedCalculatorMode = 'flat' | 'booklet'
export type SharedSizeMode = 'standard' | 'custom'
export type SharedInputUnit = 'mm' | 'cm' | 'm' | 'in'
export type SharedColorMode = 'BW' | 'COLOR'
export type SharedSides = 'SIMPLEX' | 'DUPLEX'
export type SharedSelectedSide = 'front' | 'back' | 'both'

export interface SharedFinishingSelection {
  finishing_rate_id: number
  selected_side: SharedSelectedSide
}

export interface SharedCalculatorRequestModel {
  mode: SharedCalculatorMode
  productTitle: string
  quantity: number
  sizeMode: SharedSizeMode
  sizeLabel: string
  inputUnit: SharedInputUnit
  widthInput: string
  heightInput: string
  widthMm: number | null
  heightMm: number | null
  turnaroundHours: number | null
  customBrief: string
  flat: {
    printSides: SharedSides
    colorMode: SharedColorMode
    paperType: string
    sheetSize: string
    paperGsm: number | null
    finishings: SharedFinishingSelection[]
  }
  booklet: {
    totalPages: number
    bindingType: 'saddle_stitch' | 'perfect_bind' | 'wire_o'
    bookletSize: string
    coverPaperType: string
    coverPrintSides: SharedSides
    coverColorMode: SharedColorMode
    coverPaperGsm: number | null
    coverFinishingMode: 'none' | 'front' | 'both'
    insertsColorMode: SharedColorMode
    insertsPaperType: string
    insertsPaperGsm: number | null
    sheetSize: string
    finalFinishings: SharedFinishingSelection[]
  }
}

export function createSharedCalculatorRequest(mode: SharedCalculatorMode): SharedCalculatorRequestModel {
  return {
    mode,
    productTitle: '',
    quantity: 100,
    sizeMode: 'standard',
    sizeLabel: 'A5',
    inputUnit: 'mm',
    widthInput: '',
    heightInput: '',
    widthMm: null,
    heightMm: null,
    turnaroundHours: 24,
    customBrief: '',
    flat: {
      printSides: 'SIMPLEX',
      colorMode: 'COLOR',
      paperType: '',
      sheetSize: '',
      paperGsm: null,
      finishings: [],
    },
    booklet: {
      totalPages: 12,
      bindingType: 'saddle_stitch',
      bookletSize: '',
      coverPaperType: '',
      coverPrintSides: 'DUPLEX',
      coverColorMode: 'COLOR',
      coverPaperGsm: null,
      coverFinishingMode: 'none',
      insertsColorMode: 'COLOR',
      insertsPaperType: '',
      insertsPaperGsm: null,
      sheetSize: '',
      finalFinishings: [],
    },
  }
}

export function toFlatCalculatorPayload(
  model: SharedCalculatorRequestModel,
  extras: {
    shop: number | null
    paper: number | null
    machine: number | null
    applyDuplexSurcharge?: boolean | null
  },
) {
  return {
    shop: extras.shop,
    quantity: model.quantity,
    paper: extras.paper,
    machine: extras.machine,
    color_mode: model.flat.colorMode,
    sides: model.flat.printSides,
    apply_duplex_surcharge: extras.applyDuplexSurcharge ?? null,
    finishings: model.flat.finishings,
    size_mode: model.sizeMode,
    size_label: model.sizeLabel,
    input_unit: model.inputUnit,
    width_input: model.widthInput,
    height_input: model.heightInput,
    width_mm: model.widthMm,
    height_mm: model.heightMm,
  }
}

export function toFlatCalculatorSnapshot(
  model: SharedCalculatorRequestModel,
  extras: {
    paper: number | null
    machine: number | null
    applyDuplexSurcharge?: boolean | null
  },
) {
  return {
    pricing_mode: 'custom',
    quote_type: 'flat',
    product_title: model.productTitle,
    quantity: model.quantity,
    paper: extras.paper,
    paper_id: extras.paper,
    paper_type: model.flat.paperType,
    paper_gsm: model.flat.paperGsm,
    sheet_size: model.flat.sheetSize,
    machine: extras.machine,
    color_mode: model.flat.colorMode,
    sides: model.flat.printSides,
    apply_duplex_surcharge: extras.applyDuplexSurcharge ?? null,
    finishings: model.flat.finishings,
    size_mode: model.sizeMode,
    size_label: model.sizeLabel,
    input_unit: model.inputUnit,
    width_input: model.widthInput,
    height_input: model.heightInput,
    width_mm: model.widthMm,
    height_mm: model.heightMm,
    custom_brief: model.customBrief,
  }
}

export function toBookletCalculatorPayload(
  model: SharedCalculatorRequestModel,
  extras: {
    shop: number | null
    coverPaper: number | null
    insertPaper: number | null
    coverLaminationFinishingRate: number | null
    bindingFinishingRate: number | null
  },
) {
  return {
    shop: extras.shop,
    quantity: model.quantity,
    total_pages: model.booklet.totalPages,
    binding_type: model.booklet.bindingType,
    cover_paper: extras.coverPaper,
    insert_paper: extras.insertPaper,
    cover_sides: model.booklet.coverPrintSides,
    insert_sides: 'DUPLEX',
    cover_color_mode: model.booklet.coverColorMode,
    insert_color_mode: model.booklet.insertsColorMode,
    cover_lamination_mode: model.booklet.coverFinishingMode,
    cover_lamination_finishing_rate: extras.coverLaminationFinishingRate,
    finishings: model.booklet.finalFinishings,
    binding_finishing_rate: extras.bindingFinishingRate,
    turnaround_hours: model.turnaroundHours,
    size_mode: model.sizeMode,
    size_label: model.sizeLabel,
    input_unit: model.inputUnit,
    width_input: model.widthInput,
    height_input: model.heightInput,
    width_mm: model.widthMm,
    height_mm: model.heightMm,
  }
}

export function toBookletCalculatorSnapshot(
  model: SharedCalculatorRequestModel,
  extras: {
    shop: number | null
    coverPaper: number | null
    insertPaper: number | null
    coverLaminationFinishingRate: number | null
    bindingFinishingRate: number | null
  },
) {
  return {
    quote_type: 'booklet',
    product_title: model.productTitle,
    custom_brief: model.customBrief,
    cover_paper_type: model.booklet.coverPaperType,
    cover_paper_gsm: model.booklet.coverPaperGsm,
    inserts_paper_type: model.booklet.insertsPaperType,
    inserts_paper_gsm: model.booklet.insertsPaperGsm,
    sheet_size: model.booklet.sheetSize,
    ...toBookletCalculatorPayload(model, extras),
  }
}
