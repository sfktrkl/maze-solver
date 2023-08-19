use rand::Rng;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[derive(Clone)]
    pub type Cell;

    #[wasm_bindgen(method, js_name = setLeftWall)]
    pub fn set_left_wall(this: &Cell, value: bool);

    #[wasm_bindgen(method, js_name = setRightWall)]
    pub fn set_right_wall(this: &Cell, value: bool);

    #[wasm_bindgen(method, js_name = setTopWall)]
    pub fn set_top_wall(this: &Cell, value: bool);

    #[wasm_bindgen(method, js_name = setBottomWall)]
    pub fn set_bottom_wall(this: &Cell, value: bool);

    #[wasm_bindgen(method, js_name = setVisited)]
    pub fn set_visited(this: &Cell, value: bool);

    #[wasm_bindgen(method, js_name = getVisited)]
    pub fn get_visited(this: &Cell) -> bool;

    #[wasm_bindgen(method)]
    pub async fn draw(this: &Cell);
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
    pub async fn break_entrance_and_exit(&mut self) {
        if let Some(cell) = self.cells_js[0][0].as_mut() {
            cell.set_top_wall(false);
            cell.draw().await;
        }

        let last_row = self.cells_js.len() - 1;
        let last_col = self.cells_js[0].len() - 1;

        if let Some(cell) = self.cells_js[last_row][last_col].as_mut() {
            cell.set_bottom_wall(false);
            cell.draw().await;
        }
    }

    #[wasm_bindgen]
    pub async fn break_walls(&mut self) {
        self.break_walls_iterative(0, 0).await;
    }

    #[wasm_bindgen]
    pub fn reset_visited(&mut self) {
        let row_count = self.cells_js.len();
        let column_count = self.cells_js[0].len();
        for i in 0..row_count {
            for j in 0..column_count {
                if let Some(cell) = &self.cells_js[i][j] {
                    cell.set_visited(false);
                }
            }
        }
    }

    async fn break_walls_iterative(&mut self, start_i: usize, start_j: usize) {
        let mut stack = vec![(start_i, start_j)];
        let row_count = self.cells_js.len();
        let column_count = self.cells_js[0].len();
        while let Some((i, j)) = stack.pop() {
            if let Some(cell) = &self.cells_js[i][j] {
                cell.set_visited(true);

                let mut next_index_list = vec![];
                if i > 0 {
                    if let Some(cell) = &self.cells_js[i - 1][j] {
                        if !cell.get_visited() {
                            next_index_list.push((i - 1, j));
                        }
                    }
                }
                if i < row_count - 1 {
                    if let Some(cell) = &self.cells_js[i + 1][j] {
                        if !cell.get_visited() {
                            next_index_list.push((i + 1, j));
                        }
                    }
                }
                if j > 0 {
                    if let Some(cell) = &self.cells_js[i][j - 1] {
                        if !cell.get_visited() {
                            next_index_list.push((i, j - 1));
                        }
                    }
                }
                if j < column_count - 1 {
                    if let Some(cell) = &self.cells_js[i][j + 1] {
                        if !cell.get_visited() {
                            next_index_list.push((i, j + 1));
                        }
                    }
                }

                if next_index_list.is_empty() {
                    cell.draw().await;
                } else {
                    let mut rng = rand::thread_rng();
                    let random_index = rng.gen_range(0..next_index_list.len());
                    let (next_i, next_j) = next_index_list[random_index];

                    if let Some(cell) = &self.cells_js[i][j] {
                        if next_i == i + 1 {
                            cell.set_bottom_wall(false);
                            if let Some(cell) = &self.cells_js[next_i][j] {
                                cell.set_top_wall(false);
                            }
                        }
                        if i > 0 && next_i == i - 1 {
                            cell.set_top_wall(false);
                            if let Some(cell) = &self.cells_js[next_i][j] {
                                cell.set_bottom_wall(false);
                            }
                        }
                        if next_i == i + 1 {
                            cell.set_bottom_wall(false);
                            if let Some(cell) = &self.cells_js[next_i][j] {
                                cell.set_top_wall(false);
                            }
                        }
                        if j > 0 && next_j == j - 1 {
                            cell.set_left_wall(false);
                            if let Some(cell) = &self.cells_js[i][next_j] {
                                cell.set_right_wall(false);
                            }
                        }
                        if next_j == j + 1 {
                            cell.set_right_wall(false);
                            if let Some(cell) = &self.cells_js[i][next_j] {
                                cell.set_left_wall(false);
                            }
                        }
                    }

                    stack.push((i, j)); // Push current cell back onto the stack
                    stack.push((next_i, next_j)); // Push next cell onto the stack
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
