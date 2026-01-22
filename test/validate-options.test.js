import CompressionPlugin from "../src";

describe("validate options", () => {
  const tests = {
    test: {
      success: [
        /foo/,
        "foo",
        [/foo/],
        [/foo/, /bar/],
        ["foo", "bar"],
        [/foo/, "bar"],
      ],
      failure: [true, [true], [/foo/, "foo", true]],
    },
    include: {
      success: [
        /foo/,
        "foo",
        [/foo/],
        [/foo/, /bar/],
        ["foo", "bar"],
        [/foo/, "bar"],
      ],
      failure: [true, [true], [/foo/, "foo", true]],
    },
    exclude: {
      success: [
        /foo/,
        "foo",
        [/foo/],
        [/foo/, /bar/],
        ["foo", "bar"],
        [/foo/, "bar"],
      ],
      failure: [true, [true], [/foo/, "foo", true]],
    },
    filename: {
      success: ["[path].gz[query]", () => {}],
      failure: [true],
    },
    algorithm: {
      success: ["gzip", () => {}],
      failure: [true],
    },
    compressionOptions: {
      success: [{ level: 1 }, { unknown: 1 }],
      failure: ["1024"],
    },
    threshold: {
      success: [1024],
      failure: ["1024"],
    },
    minRatio: {
      success: [0.8],
      failure: ["0.8"],
    },
    deleteOriginalAssets: {
      success: [true, false, "keep-source-map", () => true],
      failure: ["true", "unknown"],
    },
    parallel: {
      success: [true, false, 2],
      failure: ["true", "2", {}],
    },
    unknown: {
      success: [],
      failure: [1, true, false, "test", /test/, [], {}, { foo: "bar" }],
    },
  };

  function stringifyValue(value) {
    if (
      Array.isArray(value) ||
      (value && typeof value === "object" && value.constructor === Object)
    ) {
      return JSON.stringify(value);
    }

    return value;
  }

  async function createTestCase(key, value, type) {
    it(`should ${
      type === "success" ? "successfully validate" : "throw an error on"
    } the "${key}" option with "${stringifyValue(value)}" value`, async () => {
      let error;

      try {
        // eslint-disable-next-line no-new
        new CompressionPlugin({ [key]: value });
      } catch (err) {
        if (err.name !== "ValidationError") {
          throw err;
        }

        error = err;
      } finally {
        if (type === "success") {
          expect(error).toBeUndefined();
        } else if (type === "failure") {
          expect(() => {
            throw error;
          }).toThrowErrorMatchingSnapshot();
        }
      }
    });
  }

  for (const [key, values] of Object.entries(tests)) {
    for (const type of Object.keys(values)) {
      for (const value of values[type]) {
        createTestCase(key, value, type);
      }
    }
  }
});
