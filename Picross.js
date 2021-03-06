class Picross
{
	constructor(width, height)
	{
		this.element = null;
		this.width = width;
		this.height = height;
		this.bindedCheckSuccess = this.checkSuccess.bind(this);
		
		this.clear();
	}
		
	clear()
	{
		this.rows = this.create2DArray(this.height, this.width);
		this.columns = this.create2DArray(this.width, this.height);
	}
	
	create2DArray(firstDimensionLength, secondDimensionLength)
	{	
		let array = [];
			
		for(let i = 0; i < firstDimensionLength; i++)
		{
			let innerArray = [];
						
			for(let j = 0; j < secondDimensionLength; j++)
			{
				innerArray.push(false);
			}

			array.push(innerArray);
		}

		return array;
	}
	
	getWidth()
	{
		return this.width;
	}
	
	getHeight()
	{
		return this.height;
	}
	
	setCell(x, y, state)
	{		
		this.rows[y][x] = state;
		this.columns[x][y] = state;
	}
	
	getRowHint(rowIndex)
	{
		return this.getHintForLine(this.rows[rowIndex]);
	}
	
	getColumnHint(columnIndex)
	{
		return this.getHintForLine(this.columns[columnIndex]);
	}
	
	getHintForLine(line)
	{
		let hints = [];
		
		let isInSerie = false;
		let serieLength = 0;
		
		for(let cell of line)
		{
			if(cell)
			{
				if(isInSerie)
				{
					serieLength++;
				}
				else
				{
					isInSerie = true;
					serieLength = 1;
				}
			}
			else
			{
				if(isInSerie)
				{
					isInSerie = false;
					hints.push(serieLength);
				}
			}
		}
		
		if(isInSerie)
		{
			hints.push(serieLength);
		}
		else if(hints.length == 0)
		{
			hints.push(0);
		}
		
		return hints;
	}
	
	areRowsValid(rows)
	{
		return this.are2DArraysEquals(rows, this.rows);
	}
	
	areColumnsValid(columns)
	{
		return this.are2DArraysEquals(columns, this.columns);
	}
	
	are2DArraysEquals(array1, array2)
	{
		let allEquals = true;
		
		for(let i = 0; i < array1.length; i++)
		{
			for(let j = 0; j < array1[i].length; j++)
			{
				allEquals &= (array1[i][j] == array2[i][j]);
			}
		}
		
		return allEquals;
	}
	
	attach(element, empty = true, showHint = true)
	{		
		this.element = element;
		this.display(empty, showHint);
	}
	
	display(showHint, empty)
	{
		if(this.element != undefined)
		{
			this.element.innerHTML = "";
			
			if(showHint)
			{
				this.element.appendChild(this.createGridHeaderElement());
			}
			
			for(let row of this.createRowElements(showHint, empty))
			{
				this.element.appendChild(row);
			}
		}
	}
	
	createGridHeaderElement()
	{
		let headerRow = this.createRowElement();
		headerRow.appendChild(this.createHintElement(""));
		
		for(let columnIndex = 0; columnIndex < this.getWidth(); columnIndex++)
		{
			headerRow.appendChild(this.createHintForColumnElement(columnIndex));
		}
		
		return headerRow;
	}
	
	createRowElement()
	{
		let row = document.createElement("div");
		row.classList.add("row");
		return row;
	}
	
	createHintForColumnElement(columnIndex)
	{
		let content = "<span>" + this.getColumnHint(columnIndex).join("</span><span>") + "</span>";
		return this.createHintElement(content);
	}
	
	createHintElement(content)
	{
		let hint = this.createCellElement();
		hint.classList.add("hint");
		
		hint.innerHTML = content;
		
		return hint;
	}
	
	createCellElement(active)
	{
		let cell = document.createElement("span");
		cell.classList.add("cell");
	
		if(active != undefined && active)
		{
			cell.classList.add("active");
		}
	
		return cell;
	}
	
	createRowElements(showHint, empty)
	{
		let rows = [];
		
		for(let rowIndex = 0; rowIndex < this.getHeight(); rowIndex++)
		{
			let row = this.createRowElement();
			
			if(showHint)
			{
				row.appendChild(this.createHintOfRowElement(rowIndex));
			}
			
			for(let cell of this.createCellsOfRowElements(rowIndex, empty))
			{
				row.appendChild(cell);
			}
			
			rows.push(row);
		}
		
		return rows;
	}
	
	createHintOfRowElement(rowIndex)
	{
		let content = "<span>" + this.getRowHint(rowIndex).join("</span><span>") + "</span>";
		return this.createHintElement(content);
	}
	
	createCellsOfRowElements(rowIndex, empty)
	{
		let cells = [];
		
		for(let columnIndex = 0; columnIndex < this.getWidth(); columnIndex++)
		{
			let cell = this.createCellElement(!empty && this.rows[rowIndex][columnIndex]);
			
			cell.addEventListener("click", event => {
				this.clickOn(event.target);
			});
			cell.addEventListener("contextmenu", event => {
				this.rightClickOn(event.target);				
				event.preventDefault();
			});
			
			cells.push(cell);
		}
		
		return cells;
	}
	
	clickOn(cell)
	{
		if(cell.classList.contains("marked"))
		{
			cell.classList.remove("marked");
		}
		else
		{
			cell.classList.toggle("active");
			this.element.dispatchEvent(new Event("change"));
		}
	}
	
	rightClickOn(cell)
	{
		if(cell.classList.contains("active"))
		{
			cell.classList.remove("active");
		}
		else
		{
			cell.classList.toggle("marked");
		}
	}
	
	clearDisplay()
	{
		for(let cell of this.element.getElementsByClassName("cell"))
		{
			cell.classList.remove("active");
			cell.classList.remove("marked");
		}
	}
	
	regenerate(newWidth, newHeight, empty = true, showHint = true)
	{	
		this.resize(newWidth, newHeight);
		this.randomize();
		this.display(empty, showHint);
	}
	
	resize(newWidth, newHeight)
	{
		if(newWidth != undefined)
		{
			this.width = newWidth;
		}
		if(newHeight != undefined)
		{
			this.height = newHeight;
		}
		
		this.clear();
	}
	
	resizeAndRefresh(newWidth, newHeight, empty = true, showHint = true)
	{
		this.resize(newWidth, newHeight);
		this.display(empty, showHint);
	}
	
	randomize()
	{
		this.clear();
		
		let repetition = (this.getWidth() * this.getHeight()) * Math.max(0.25, Math.min(0.5, Math.random()));
		
		for(let i = 0; i < repetition; i++)
		{
			let x = Picross.randomInt(0, this.getWidth());
			let y = Picross.randomInt(0, this.getHeight());
			this.setCell(x, y, true);
		}
	}
	
	erase()
	{
		this.clear();
		this.clearDisplay();
	}
	
	asRows()
	{
		return [...this.rows];
	}
	
	asColumns()
	{
		return [...this.columns];
	}
	
	forRows(rows)
	{
		let height = rows.length;
		let width = rows[0].length;
		
		this.resize(width, height);
		
		for(let y = 0; y < height; y++)
		{
			for(let x = 0; x < width; x++)
			{
				this.setCell(x, y, rows[y][x]);
			}
		}
	}
	
	displayAsRows()
	{
		let rows = [];
				
		for(let row of this.element.children)
		{					
			let currentRow = [];
				
			for(let cell of row.children)
			{
				if(!cell.classList.contains("hint"))
				{
					currentRow.push(cell.classList.contains("active"));
				}
			}
			
			if(currentRow.length > 0)
			{
				rows.push(currentRow);
			}
			
		}
		
		return rows;
	}
	
	isDisplayValid()
	{
		return this.areRowsValid(this.displayAsRows());
	}
	
	enableSuccessChecking()
	{
		this.element.addEventListener("change", this.bindedCheckSuccess);
	}
	
	disableSuccessChecking()
	{
		this.element.removeEventListener("change", this.bindedCheckSuccess);
	}
	
	checkSuccess(event)
	{
		if(this.isDisplayValid())
		{
			alert("You Win !");
		}
	}
	
	static generate(width, height)
	{
		let picross = new Picross(width, height);
		picross.randomize();
		return picross;
	}
	
	static randomInt(min, max)
	{
		return Math.floor(Math.random() * (max - min) + min);
	}
}
