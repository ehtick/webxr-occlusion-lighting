export class ObjectUtils {
	static centerUnitary(object)
	{
		var box = ObjectUtils.calculateBoundingBox(object);

		if (box !== null)
		{
			var size = new Vector3();
			box.getSize(size);

			var scale = 1 / (size.x > size.y ? size.x > size.z ? size.x : size.z : size.y > size.z ? size.y : size.z);

			var center = new Vector3();
			box.getCenter(center);
			center.multiplyScalar(scale);

			object.scale.set(scale, scale, scale);
			object.position.set(-center.x, -scale * box.min.y, -center.z);
		}
	};

	/**
	 * Calculates a bounding box for an object considering all its children.
	 *
	 * Includes booth the object and all of its children, the box is adjusted to world space coordinates.
	 *
	 * @param {Object3D} object Root object to be traversed.
	 * @return {Box3} Bounding box of the object considering all of its children.
	 */
	static calculateBoundingBox(object)
	{
		var box = null;

		object.traverse(function(children)
		{
			var bounding = null;

			// Mesh, Points, Lines
			if (children.geometry !== undefined)
			{
				children.geometry.computeBoundingBox();
				bounding = children.geometry.boundingBox.clone();
				bounding.applyMatrix4(children.matrixWorld);

				children.geometry.computeBoundingBox();
				bounding = children.geometry.boundingBox;
			}

			// Update bouding box size
			if (bounding !== null)
			{
				// First box
				if (box === null)
				{
					box = bounding;
				}
				// Ajust box size to contain new box
				else
				{
					if (bounding.min.x < box.min.x) {box.min.x = bounding.min.x;}
					if (bounding.max.x > box.max.x) {box.max.x = bounding.max.x;}
					if (bounding.min.y < box.min.y) {box.min.y = bounding.min.y;}
					if (bounding.max.y > box.max.y) {box.max.y = bounding.max.y;}
					if (bounding.min.z < box.min.z) {box.min.z = bounding.min.z;}
					if (bounding.max.z > box.max.z) {box.max.z = bounding.max.z;}
				}
			}
		});

		return box;
	}
}
