use rand::Rng;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[derive(Clone)]
    pub type Cell;

    #[wasm_bindgen(method)]
    pub fn setLeftWall(this: &Cell, value: bool);

    #[wasm_bindgen(method)]
    pub fn setRightWall(this: &Cell, value: bool);

    #[wasm_bindgen(method)]
    pub fn setTopWall(this: &Cell, value: bool);

    #[wasm_bindgen(method)]
    pub fn setBottomWall(this: &Cell, value: bool);

    #[wasm_bindgen(method)]
    pub fn setVisited(this: &Cell, value: bool);

    #[wasm_bindgen(method)]
    pub fn getVisited(this: &Cell) -> bool;

    #[wasm_bindgen(method)]
    pub fn draw(this: &Cell);
}

#[wasm_bindgen]
pub struct MazeSolver {
    cells: Vec<Vec<Vec<f32>>>,
    cells_js: Vec<Vec<Option<Cell>>>,
}

#[wasm_bindgen]
impl MazeSolver {
    #[wasm_bindgen(constructor)]
    pub fn new(height: usize, width: usize, row_count: usize, column_count: usize) -> Self {
        let cells = MazeSolver::generate_cells(height, width, row_count, column_count);
        let cells_js = vec![vec![None; column_count]; row_count];
        MazeSolver { cells, cells_js }
    }

    #[wasm_bindgen]
    pub fn get_cell(&self, row: usize, column: usize, index: usize) -> f32 {
        self.cells[row][column][index]
    }

    #[wasm_bindgen]
    pub fn set_cell(&mut self, row: usize, column: usize, cell: Cell) {
        self.cells_js[row][column] = Some(cell);
    }

    #[wasm_bindgen]
    pub fn break_entrance_and_exit(&mut self) {
        if let Some(cell) = self.cells_js[0][0].as_mut() {
            cell.setTopWall(false);
            cell.draw();
        }

        let last_row = self.cells_js.len() - 1;
        let last_col = self.cells_js[0].len() - 1;

        if let Some(cell) = self.cells_js[last_row][last_col].as_mut() {
            cell.setBottomWall(false);
            cell.draw();
        }
    }

    #[wasm_bindgen]
    pub fn break_walls(&mut self) {
        self.break_walls_recursive(0, 0);
    }

    fn break_walls_recursive(&mut self, i: usize, j: usize) {
        if let Some(cell) = &self.cells_js[i][j] {
            cell.setVisited(true);
            let row_count = self.cells_js.len();
            let column_count = self.cells_js[0].len();
            loop {
                let mut next_index_list = vec![];
                // Determine which cell(s) to visit next
                if i > 0 {
                    if let Some(cell) = &self.cells_js[i - 1][j] {
                        if !cell.getVisited() {
                            next_index_list.push((i - 1, j));
                        }
                    }
                }
                if i < row_count - 1 {
                    if let Some(cell) = &self.cells_js[i + 1][j] {
                        if !cell.getVisited() {
                            next_index_list.push((i + 1, j));
                        }
                    }
                }
                if j > 0 {
                    if let Some(cell) = &self.cells_js[i][j - 1] {
                        if !cell.getVisited() {
                            next_index_list.push((i, j - 1));
                        }
                    }
                }
                if j < column_count - 1 {
                    if let Some(cell) = &self.cells_js[i][j + 1] {
                        if !cell.getVisited() {
                            next_index_list.push((i, j + 1));
                        }
                    }
                }

                // If there is nowhere to go from here, just break out
                if next_index_list.is_empty() {
                    if let Some(cell) = &self.cells_js[i][j] {
                        cell.draw();
                        return;
                    }
                } else {
                    let mut rng = rand::thread_rng();
                    let random_index = rng.gen_range(0..next_index_list.len());
                    let (next_i, next_j) = next_index_list[random_index];
                    // knock out walls between this cell and the next cell(s)
                    if let Some(cell) = &self.cells_js[i][j] {
                        if next_i == i + 1 {
                            cell.setBottomWall(false);
                            if let Some(cell) = &self.cells_js[next_i][j] {
                                cell.setTopWall(false);
                            }
                        }
                        if i > 0 && next_i == i - 1 {
                            cell.setTopWall(false);
                            if let Some(cell) = &self.cells_js[next_i][j] {
                                cell.setBottomWall(false);
                            }
                        }
                        if next_j == j + 1 {
                            cell.setRightWall(false);
                            if let Some(cell) = &self.cells_js[i][next_j] {
                                cell.setLeftWall(false);
                            }
                        }
                        if j > 0 && next_j == j - 1 {
                            cell.setLeftWall(false);
                            if let Some(cell) = &self.cells_js[i][next_j] {
                                cell.setRightWall(false);
                            }
                        }
                    }

                    // recursively visit the next cell
                    self.break_walls_recursive(next_i, next_j);
                }
            }
        }
    }

    fn generate_cells(
        height: usize,
        width: usize,
        row_count: usize,
        column_count: usize,
    ) -> Vec<Vec<Vec<f32>>> {
        let x = width as f32 / column_count as f32;
        let y = height as f32 / row_count as f32;

        let mut cells = Vec::new();
        for i in 0..row_count {
            let mut row = Vec::new();
            for j in 0..column_count {
                let mut cell = Vec::new();
                cell.push(j as f32 * x);
                cell.push(i as f32 * y);
                cell.push((j + 1) as f32 * x);
                cell.push((i + 1) as f32 * y);
                row.push(cell);
            }
            cells.push(row);
        }
        cells
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_maze_create_cells() {
        let m1 = MazeSolver::new(10, 10, 12, 10);
        assert_eq!(m1.cells.len(), 12);
        assert_eq!(m1.cells[0].len(), 10);
    }

    #[test]
    fn test_maze_create_cells_large() {
        let m1 = MazeSolver::new(10, 10, 16, 12);
        assert_eq!(m1.cells.len(), 16);
        assert_eq!(m1.cells[0].len(), 12);
    }
}
