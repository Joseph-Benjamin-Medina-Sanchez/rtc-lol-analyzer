import { PositionCoordinate } from "../entities/riot-entities";

export interface NormalizedCoordinate {
  xPercent: number;
  yPercent: number;
}

export class CoordinateNormalizer {
  private static readonly MIN_COORDINATE = 0;
  private static readonly MAX_COORDINATE = 15000;

  static toPercentages(coordinate?: PositionCoordinate): NormalizedCoordinate {
    if (!coordinate) {
      return { xPercent: 0, yPercent: 0 };
    }

    const clampedX = Math.max(
      this.MIN_COORDINATE,
      Math.min(coordinate.x, this.MAX_COORDINATE)
    );
    const clampedY = Math.max(
      this.MIN_COORDINATE,
      Math.min(coordinate.y, this.MAX_COORDINATE)
    );

    const xPercent = Number(
      ((clampedX / this.MAX_COORDINATE) * 100).toFixed(2)
    );
    const yPercent = Number(
      ((1 - clampedY / this.MAX_COORDINATE) * 100).toFixed(2)
    );

    return { xPercent, yPercent };
  }
}