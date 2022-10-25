import { Instance } from 'pspdfkit';
import React from 'react';
// import { getPageCount } from '.';

interface Props {
  file: File;
  children: (state: State) => void;
}

interface State {
  removeItemsFromViewer: (instance: Instance) => void;
  customizeThumbnails: (containerNode: Node) => void;
  width: string;
  height: string;
  pages: number[];
}

export default class DeletePages extends React.Component<Props, State> {
  removeItemsFromViewer = (instance: Instance) => {
    const items = instance.toolbarItems;
    instance.setToolbarItems(
      items.filter(
        (item) =>
          item.type !== 'ink' &&
          item.type !== 'annotate' &&
          item.type !== 'highlighter' &&
          item.type !== 'search' &&
          item.type !== 'comment' &&
          item.type !== 'text' &&
          item.type !== 'document-editor' &&
          item.type !== 'note' &&
          item.type !== 'text-highlighter' &&
          item.type !== 'document-crop' &&
          item.type !== 'dashed-ellipse' &&
          item.type !== 'ink-eraser' &&
          item.type !== 'image' &&
          item.type !== 'line' &&
          item.type !== 'stamp' &&
          item.type !== 'signature' &&
          item.type !== 'arrow' &&
          item.type !== 'rectangle' &&
          item.type !== 'ellipse' &&
          item.type !== 'polygon' &&
          item.type !== 'cloudy-ellipse' &&
          item.type !== 'cloudy-rectangle' &&
          item.type !== 'polyline' &&
          item.type !== 'cloudy-polygon'
      )
    );
  };

  customizeThumbnails = (containerNode: Node) => {
    const thumbnails = Array.from(
      (containerNode as HTMLElement).getElementsByClassName(
        'PSPDFKit-Sidebar-Thumbnails-Page'
      )
    );

    thumbnails.forEach((c, idx) => {
      const ele = document.createElement('div');
      ele.style.width = '20px';
      ele.style.height = '20px';
      ele.style.position = 'absolute';
      ele.style.marginRight = '2rem';
      ele.style.left = '1rem';
      ele.style.border = '2px solid purple';
      ele.style.borderRadius = '3px';
      ele.style.cursor = 'pointer';
      ele.style.transition = 'all .3s';
      ele.style.display = 'flex';
      ele.style.justifyContent = 'center';
      ele.style.alignItems = 'center';

      const selected = document.createElement('div');
      ele.addEventListener(
        'click',
        this.addCheckMark.bind(this, ele, selected, idx),
      );

      (c as HTMLDivElement).style.position = 'relative';
      (c as HTMLDivElement).prepend(ele);
    });
  };

  addCheckMark = (
    ele: HTMLDivElement,
    selected: HTMLDivElement,
    idx: number
  ) => {
    const p = this.state.pages.find((e) => e === idx + 1);
    if (!p) {
      selected.style.width = '12px';
      selected.style.height = '12px';
      selected.style.backgroundColor = 'purple';
      ele.appendChild(selected);
      this.setState({ pages: [...this.state.pages, idx + 1] });
    } else {
      this.setState({ pages: this.state.pages.filter((e) => e !== p) });
      ele.removeChild(selected);
    }
  };

  state = {
    removeItemsFromViewer: this.removeItemsFromViewer,
    customizeThumbnails: this.customizeThumbnails,
    width: '100%',
    height: '100vh',
    pages: [],
  };

  render() {
    return <>{this.props.children(this.state)}</>;
  }
}
