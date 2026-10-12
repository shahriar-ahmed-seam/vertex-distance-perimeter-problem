# Makefile for compiling the Triangle Theorem Monograph

PDFLATEX = pdflatex -interaction=nonstopmode -halt-on-error
BIBTEX = bibtex
TARGET = main

all: $(TARGET).pdf

$(TARGET).pdf: main.tex bibliography.bib chapters/*.tex
	$(PDFLATEX) $(TARGET)
	$(BIBTEX) $(TARGET)
	$(PDFLATEX) $(TARGET)
	$(PDFLATEX) $(TARGET)

clean:
	rm -f *.aux *.log *.out *.toc *.lof *.lot *.bbl *.blg *.synctex.gz
	rm -f chapters/*.aux

distclean: clean
	rm -f $(TARGET).pdf

.PHONY: all clean distclean
