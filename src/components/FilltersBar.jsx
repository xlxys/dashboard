export default function FillterBar(){
  return (
    <div className="filters-bar">
      <div className="filters-bar__filter">
        <label className="filters-bar__filter__label">Filter 1</label>
        <select className="filters-bar__filter__select">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </select>
      </div>
      <div className="filters-bar__filter">
        <label className="filters-bar__filter__label">Filter 2</label>
        <select className="filters-bar__filter__select">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </select>
      </div>
      <div className="filters-bar__filter">
        <label className="filters-bar__filter__label">Filter 3</label>
        <select className="filters-bar__filter__select">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </select>
      </div>
    </div>
  );
}
