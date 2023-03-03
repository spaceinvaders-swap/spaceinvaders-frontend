import React from "react";
import { renderWithProvider } from "../../testHelpers";
import Text from "../../components/Text/Text";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Text>spaceinvaders</Text>);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      color: var(--colors-text);
      font-weight: 400;
      line-height: 1.5;
      font-size: 16px;
    }

    <div
        class="c0"
        color="text"
        font-size="16px"
      >
        spaceinvaders
      </div>
    </DocumentFragment>
  `);
});
