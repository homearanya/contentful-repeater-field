import React, { useState, useEffect } from "react"
import {
  Form,
  TextField,
  TextInput,
  Textarea,
  Flex,
  FormLabel,
  CardDragHandle,
  Button,
  Icon,
  CheckboxField,
} from "@contentful/forma-36-react-components"
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  SortEndHandler,
} from "react-sortable-hoc"
import { FieldExtensionSDK } from "contentful-ui-extensions-sdk"
import arrayMove from "array-move"

interface FieldProps {
  sdk: FieldExtensionSDK
}

interface Item {
  title: string
  content: string
  hide?: boolean
}

const DragHandle = SortableHandle(() => (
  <CardDragHandle>Reorder item</CardDragHandle>
))

const SortableItem = SortableElement(
  (props: { children: React.ReactElement }) => <>{props.children}</>
)

interface SortableListProps {
  items: Item[]
  updateItems: (newItems: Item[]) => void
}

const SortableList = SortableContainer(
  ({ items, updateItems }: SortableListProps) => (
    <div>
      {items.map((item, index) => (
        <SortableItem key={`${item.title}-${index}`} index={index}>
          <Flex marginBottom="spacingS">
            <Flex alignSelf="stretch" marginRight="spacingS">
              <DragHandle />
            </Flex>
            <Flex marginRight="spacingS">
              <Flex marginBottom="spacingS" flexDirection="column">
                <FormLabel htmlFor={`title-${index}`}>Title</FormLabel>
                <TextInput
                  required
                  name={`title-${index}`}
                  id={`title-${index}`}
                  placeholder="Title"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateItems([
                      ...items.slice(0, index),
                      { ...item, title: e.target.value },
                      ...items.slice(index + 1),
                    ])
                  }
                  value={item.title}
                />
              </Flex>
            </Flex>

            <Flex flexGrow={1} flexDirection="column">
              <FormLabel htmlFor={`content-${index}`}>Content</FormLabel>
              <Textarea
                name={`content-${index}`}
                id={`content-${index}`}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  updateItems([
                    ...items.slice(0, index),
                    { ...item, content: e.target.value },
                    ...items.slice(index + 1),
                  ])
                }
                value={item.content}
                rows={1}
              />
            </Flex>
            <Flex
              marginLeft="spacingM"
              flexDirection="column"
              alignItems="center"
            >
              <FormLabel htmlFor="hide">Hide</FormLabel>
              <Flex marginLeft="spacingXs">
                <CheckboxField
                  id="hide"
                  name="hide"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateItems([
                      ...items.slice(0, index),
                      { ...item, hide: e.target.checked },
                      ...items.slice(index + 1),
                    ])
                  }
                  checked={item.hide}
                  labelText=""
                />
              </Flex>
            </Flex>
            <Flex
              marginLeft="spacingM"
              flexDirection="column"
              alignItems="center"
            >
              <FormLabel htmlFor={`content-${index}`}>Remove</FormLabel>
              <div
                onClick={() => updateItems(items.filter((e, i) => i !== index))}
                style={{ marginTop: "4px" }}
              >
                <Icon icon="Close" style={{ cursor: "pointer" }} />
              </div>
            </Flex>
          </Flex>
        </SortableItem>
      ))}
    </div>
  )
)

const Field = (props: FieldProps) => {
  const [items, setItems] = useState<Array<Item>>(props.sdk.field.getValue())

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const updateItems = (newItems: Item[]) => {
    setItems(newItems)
    props.sdk.field.setValue(newItems)
  }

  const onSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
    updateItems(arrayMove(items, oldIndex, newIndex))
  }

  useEffect(() => {
    props.sdk.window.startAutoResizer()
  }, [])

  return (
    <>
      <SortableList
        onSortEnd={onSortEnd}
        useDragHandle
        items={items}
        updateItems={updateItems}
      />
      <Flex justifyContent="flex-end" marginTop="spacing2Xl">
        <Button
          onClick={() =>
            updateItems([...items, { title: "", content: "", hide: false }])
          }
        >
          Add new
        </Button>
      </Flex>
    </>
  )
}

export default Field
