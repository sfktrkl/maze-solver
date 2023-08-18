use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct MazeSolver {
    cells: Vec<Vec<Vec<f32>>>,
}

#[wasm_bindgen]
impl MazeSolver {
    #[wasm_bindgen(constructor)]
    pub fn new(height: usize, width: usize, row_count: usize, column_count: usize) -> Self {
        let cells = MazeSolver::generate_cells(height, width, row_count, column_count);
        MazeSolver { cells }
    }

    pub fn get_cell(&self, row: usize, column: usize, index: usize) -> f32 {
        self.cells[row][column][index]
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
