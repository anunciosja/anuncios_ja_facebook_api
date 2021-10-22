const moment = require('moment')
const Excel = require('exceljs')

module.exports = {
    formaTransacao(t, digitada, recorrente) {
        let tipo = '';

        switch (t) {
            case 'credit':
            case 'debit':
                if (digitada) {
                    tipo = 'VENDA DIGITADA'
                } else {
                    if (recorrente) {
                        tipo = 'VENDA RECORRENTE'
                    } else {
                        tipo = 'VENDA CARTOES'
                    }
                }
                break;
            case 'boleto':
                tipo = 'VENDA BOLETO';
                break;
        }

        return tipo;    
    },

    tipoVenda(t) {
        let tipo = '';

        switch(t) {
            case 'credit': tipo = 'Credito'; break;
            case 'debit': tipo = 'Debito'; break;                
            case 'boleto': tipo = 'Boleto'; break;
        }

        return tipo; 
    },

    formatarStatus(stat) {
        const status_codes = {
          new: { color: "blue", label: "Nova" },
          pending: { color: "yellow", label: "Pendente" },
          pre_authorized: { color: "teal", label: "Pre-autorizacao" },
          succeeded: { color: "green", label: "Sucesso" },
          failed: { color: "red", label: "Falhou" },
          reversed: { color: "orange", label: "Invertido" },
          canceled: { color: "grey", label: "Cancelado" },
          refunded: { color: "black", label: "Reembolsado" },
          dispute: { color: "purple", label: "Reembolsado" },
          charged_back: { color: "black ", label: "Reembolsado" },
        };
    
        const status = status_codes[stat];
    
        if (status) {
          return status.label;
        } else {
          return "";
        }
    },

    async generateExcel(dadosFormatados, options) {
        try {
          let {
            worksheet_name,
            number_as_money,
            exclude_number_format,
            number_as_percentage,
            format_as_percentage,
            notHeader,
            merge_cells,
            cells_to_merge,
          } = options;
    
          if (!exclude_number_format) {
            exclude_number_format = [];
          }
    
          if (!format_as_percentage) {
            format_as_percentage = [];
          }
    
          const workbook = new Excel.Workbook();
    
          const sheet = workbook.addWorksheet(worksheet_name);
    
          const sample = Object.values(dadosFormatados[0]);
    
          const shouldFormatAsNumber = [];
          const shouldFormatAsPercentage = [];
    
          if (merge_cells) {
            cells_to_merge.forEach((c) => {
              sheet.mergeCells(c.cells);
              sheet.getCell(c.cells[0]).value = c.label;
              sheet.getCell(c.cells[0]).alignment = { horizontal: "center" };
            });
    
            sheet.getRow(2).values = Object.keys(dadosFormatados[0]).map(
              (label, index) => {
                const width =
                  ((sample[index] &&
                    (sample[index].toLocaleString().length > label.length
                      ? sample[index].toLocaleString().length
                      : label.length)) ||
                    0) + 6;
    
                const isNumber = typeof sample[index] === "number";
    
                if (!exclude_number_format.includes(label)) {
                  if (isNumber && number_as_money) {
                    shouldFormatAsNumber.push(index);
                  }
                }
    
                if (format_as_percentage.includes(label)) {
                  if (isNumber && number_as_percentage) {
                    shouldFormatAsPercentage.push(index);
                  }
                }
    
                if (notHeader) {
                  label;
                }
    
                return label;
              }
            );
          } else {
            sheet.columns = Object.keys(dadosFormatados[0]).map((label, index) => {
              const width =
                ((sample[index] &&
                  (sample[index].toLocaleString().length > label.length
                    ? sample[index].toLocaleString().length
                    : label.length)) ||
                  0) + 6;
              const isNumber = typeof sample[index] === "number";
    
              if (!exclude_number_format.includes(label)) {
                if (isNumber && number_as_money) {
                  shouldFormatAsNumber.push(index);
                }
              }
    
              if (format_as_percentage.includes(label)) {
                if (isNumber && number_as_percentage) {
                  shouldFormatAsPercentage.push(index);
                }
              }
    
              if (notHeader) {
                return {
                  width,
                  id: label.toLowerCase(),
                };
              }
    
              return {
                width,
                header: label,
                id: label.toLowerCase(),
              };
            });
          }
    
          dadosFormatados.forEach((dt) => {
            sheet.addRow(Object.values(dt)).commit();
          });
          shouldFormatAsNumber.forEach((index) => {
            sheet.getColumn(index + 1).numFmt =
              "[$R$-416] #,##0.00;-[$R$-416] #,##0.00";
          });
          shouldFormatAsPercentage.forEach((index) => {
            sheet.getColumn(index + 1).numFmt = "#,##0.00%;-#,##0.00%";
          });
          return workbook.xlsx.writeBuffer();
        } catch (error) {
          console.log(error);
        }
    }
}