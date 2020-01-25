using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Domain;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly DataContext context;

        public ValuesController(DataContext context)
        {
            this.context = context;
        }

        // GET api/values
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var values = await context.Values.ToListAsync();

            return Ok(values);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var value = await context.Values.FindAsync(id);

            if (value == null)
                return BadRequest($"Value with id {id} not found");

            return Ok(value);
        }

        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Value value)
        {
            var valueFromRepo = await context.Values.FindAsync(value.Id);

            if (valueFromRepo != null)
                return BadRequest($"Value with id {value.Id} already exist");

            await context.Values.AddAsync(value);
            await context.SaveChangesAsync();

            return NoContent();
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Value value)
        {
            if (value.Id != id)
                return BadRequest();

            var valueFromRepo = await context.Values.FirstOrDefaultAsync(v => v.Id == id);

            if (valueFromRepo == null)
                return BadRequest();

            valueFromRepo.Name = value.Name;

            await context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var valueFromRepo = await context.Values.FirstOrDefaultAsync(v => v.Id == id);

            if (valueFromRepo == null)
                return BadRequest();

            context.Remove(valueFromRepo);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}