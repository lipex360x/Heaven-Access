// A continuously visible code cannot reopen the gate after its eight-second deadline.
export class ScannerLatch {
  private latched = false;
  private clearFrames = 0;
  observe(hasCode: boolean, locked: boolean): boolean {
    if (!hasCode) {
      if (locked && ++this.clearFrames >= 3) this.latched = false;
      return false;
    }
    this.clearFrames = 0;
    if (!locked || this.latched) {
      this.latched = true;
      return false;
    }
    this.latched = true;
    return true;
  }
  requireNewPresentation() {
    this.latched = true;
    this.clearFrames = 0;
  }
}
